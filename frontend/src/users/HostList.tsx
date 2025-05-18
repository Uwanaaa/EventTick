import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import './HostList.css';

interface Host {
  _id: string;
  name: string;
  email: string;
  country: string;
}

const HostList = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/hosts', {
          withCredentials: true
        });
        setHosts(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch hosts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHosts();
  }, []);

  const handleChat = (hostId: string) => {
    navigate(`/chat/${hostId}`);
  };

  if (isLoading) {
    return (
      <div className="page-layout">
        <div className="page-container">
          <div className="loading">Loading hosts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <nav className="nav-bar">
        <div className="nav-left">
          <button className="icon-button" onClick={() => navigate('/home')} title="Back to Home">
            <IoMdArrowRoundBack />
          </button>
          <h1 className="nav-title">Available Hosts</h1>
        </div>
      </nav>

      <div className="page-container">
        <div className="hosts-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="hosts-grid">
            {hosts.map((host) => (
              <div key={host._id} className="host-card">
                <div className="host-info">
                  <h3>{host.name}</h3>
                  <p className="host-email">{host.email}</p>
                  <p className="host-country">{host.country}</p>
                </div>
                <button 
                  className="button button-primary"
                  onClick={() => handleChat(host._id)}
                >
                  Start Chat
                </button>
              </div>
            ))}
          </div>

          {hosts.length === 0 && !error && (
            <div className="no-hosts">
              <p>No hosts available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostList; 