import React, { useState, useMemo, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import ticketImg from "../assets/ticket.webp";
import { logout } from "../redux/authSlice";
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BsInboxFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Home.css";
import { useSocket } from "../utils/websocket";
import { BsPeopleFill } from "react-icons/bs";



const getUnique = (arr: any, key: any) => [...new Set(arr.map((item: any) => item[key]))];

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all"); 
  const [isLoading, setIsLoading] = useState(true);
  const {socket, isConnected} = useSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = useSelector((state: any) => state.auth.role);

  const genders = useMemo(() => ["all", ...getUnique(tickets, "gender")], [tickets]);
  const countries = useMemo(() => ["all", ...getUnique(tickets, "country")], [tickets]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
     
      const endpoint = userRole === 'host' 
        ? 'http://localhost:5000/ticket/my-tickets'
        : 'http://localhost:5000/ticket/tickets';
        
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    if (isLoading) return [];
    return tickets.filter((ticket: any) => {
      const genderMatch = genderFilter === "all" || ticket.gender === genderFilter.toLowerCase();
      const countryMatch = countryFilter === "all" || ticket.country === countryFilter;
      return genderMatch && countryMatch;
    });
  }, [tickets, genderFilter, countryFilter, isLoading]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Logout error:", error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (socket && isConnected && userRole === 'host') {
      const timer = setInterval(() => {
        console.log('Start');
        
        socket.emit('countUsersMessages');
      }, 1000);

      socket.on('usersCount', (data: any) => {
        console.log(data);
      });

      return () => clearInterval(timer);
    }
  }, [socket, isConnected]);

  return (
    <div className="home-layout">
      <nav className="nav-bar">
        <div className="nav-left">
          <h1 className="nav-title">EventTick</h1>
        </div>
        <div className="nav-right">
          {userRole === 'user' && (
            <button className="nav-icon-button" onClick={() => navigate('/hosts')} title="View Hosts">
              <BsPeopleFill size={24} />
            </button>
          )}
          <button className="nav-icon-button" onClick={() => navigate('/profile')} title="Profile">
            <CgProfile size={24} />
          </button>
          {userRole === 'host' && (
            <button className="nav-icon-button" onClick={() => navigate('/create-ticket')} title="Create Ticket">
              <IoMdAddCircle size={24} />
            </button>
          )}
          {userRole === 'user' && (
            <button className="nav-icon-button" onClick={() => navigate('/inbox')} title="Inbox">
              <BsInboxFill size={24} />
            </button>
          )}
            {userRole === 'host' && (
              <button className="nav-icon-button" onClick={() => navigate('/host-inbox')} title="Inbox">
                <BsInboxFill size={24} />
              </button>
            )}
            {userRole === 'host' && (
              <button className="nav-icon-button" onClick={() => navigate('/host-messages')} title="View Messages">
                <BsPeopleFill size={24} />
              </button>
            )}
          <button className="nav-icon-button" onClick={handleLogout} title="Logout">
            <IoMdLogOut size={24} />
          </button>
        </div>
      </nav>

      <div className="homepage-container">
        <div className="header">
          <h2>{userRole === 'host' ? 'My Tickets' : 'Available Tickets'}</h2>
        </div>
        {userRole === 'user' && (
          <div className="filters">
            <div className="filter-group">
              <label>Filter by Gender: </label>
              <div className="filter-buttons">
                {genders.map((g: any) => (
                  <button
                    key={g}
                    className={`filter-btn${genderFilter === g ? " active" : ""}`}
                    onClick={() => setGenderFilter(g)}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Filter by Country: </label>
              <div className="filter-buttons">
                {countries.map((c: any) => (
                  <button
                    key={c}
                    className={`filter-btn${countryFilter === c ? " active" : ""}`}
                    onClick={() => setCountryFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="ticket-list">
          {filteredTickets.length === 0 ? (
            <p>No tickets found for selected filters.</p>
          ) : (
            filteredTickets.map((ticket: any) => (
              <div className="ticket-card" key={ticket.id} onClick={() => navigate(`/ticket/${ticket._id}`)}>
                <img src={ticketImg} alt="ticket" className="ticket-img" />
                <div className="ticket-content">
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <div className="ticket-meta">
                    <span>Gender: {ticket.gender}</span>
                    <span>Country: {ticket.country}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;