import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TicketDetails.css';
import { IoMdArrowRoundBack } from "react-icons/io";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  gender: string;
  country: string;
  price: number;
  host: string;
}

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Omit<Ticket, '_id' | 'host'>>({
    title: '',
    description: '',
    gender: '',
    country: '',
    price: 0
  });
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get<Ticket>(`http://localhost:5000/ticket/ticket/${id}`, {
          withCredentials: true
        });
        setTicket(response.data);
        const { _id, host, ...ticketData } = response.data;
        setEditedTicket(ticketData);
        // Check if current user is the host
        const userResponse = await axios.get('http://localhost:5000/user/profile', {
          withCredentials: true
        });
        setIsHost(userResponse.data.id === response.data.host);
      } catch (error) {
        setError('Failed to fetch ticket details');
        console.error('Error:', error);
      }
    };

    fetchTicket();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (ticket) {
      const { _id, host, ...ticketData } = ticket;
      setEditedTicket(ticketData);
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTicket(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put<Ticket>(
        `http://localhost:5000/ticket/ticket/${id}`,
        editedTicket,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setTicket(response.data);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update ticket');
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await axios.delete(`http://localhost:5000/ticket/ticket/${id}`, {
          withCredentials: true
        });
        navigate('/home');
      } catch (error) {
        setError('Failed to delete ticket');
        console.error('Error:', error);
      }
    }
  };

  if (!ticket) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
    <nav className="nav-bar">
        <div className="nav-left">
          <button className="icon-button" onClick={() => navigate('/home')} title="Back to Home">
            <IoMdArrowRoundBack />
          </button>
        </div>
      </nav>
    <div className="ticket-details-container">
      {error && <div className="error-message">{error}</div>}
      
      {isEditing ? (
        <div className="edit-form">
          <h2>Edit Ticket</h2>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editedTicket.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={editedTicket.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={editedTicket.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={editedTicket.country}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={editedTicket.price}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button onClick={handleUpdate} className="update-btn">Update</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="ticket-info">
          <h2>{ticket.title}</h2>
          <p className="description">{ticket.description}</p>
          <div className="ticket-meta">
            <span>Gender: {ticket.gender}</span>
            <span>Country: {ticket.country}</span>
            <span>Price: N{ticket.price}</span>
          </div>
          {isHost && (
            <div className="button-group">
              <button onClick={handleEdit} className="edit-btn">Edit</button>
              <button onClick={handleDelete} className="delete-btn">Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default TicketDetails; 