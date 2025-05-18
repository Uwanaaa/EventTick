import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateTicket.css'; // Reusing the same styles

interface TicketFormData {
  title: string;
  description: string;
  gender: 'female' | 'male' | 'others';
  country: string;
  price: number;
}

const EditTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    gender: 'female',
    country: '',
    price: 0,
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await axios.get('https://restcountries.com/v3.1/all');
        const countryList = countriesResponse.data
          .map((data: { name: { official: string } }) => data.name.official)
          .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index)
          .sort();
        setCountries(countryList);

        // Fetch ticket data
        const ticketResponse = await axios.get(`http://localhost:5000/ticket/${id}`, {
          withCredentials: true
        });
        
        const ticketData = ticketResponse.data;
        setFormData({
          title: ticketData.title,
          description: ticketData.description,
          gender: ticketData.gender,
          country: ticketData.country,
          price: ticketData.price,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ text: "Error loading ticket data", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    try {
      const response = await axios.put(`http://localhost:5000/ticket/${id}`, formData, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        setMessage({ text: 'Ticket updated successfully!', type: 'success' });
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Error updating ticket', 
        type: 'error' 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="page-layout">
        <div className="page-container">
          <div className="form-card">
            <p>Loading...</p>
          </div>
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
          <h1 className="nav-title">Edit Ticket</h1>
        </div>
      </nav>

      <div className="page-container">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter ticket title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your ticket in detail"
                required
                rows={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">Target Gender</label>
              <p className="form-hint">Specify if your ticket is targeted towards a particular gender</p>
              <select
                id="gender"
                name="gender"
                className="form-input"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="country" className="form-label">Target Country</label>
              <p className="form-hint">Specify if your ticket is targeted towards a particular country</p>
              <select
                id="country"
                name="country"
                className="form-input"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">Price</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-input"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button type="submit" className="button button-primary">
              Update Ticket
            </button>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTicket; 