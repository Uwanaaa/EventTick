import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axios from 'axios';
import './Profile.css';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  country: string;
  role: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('http://localhost:5000/user/user-data', {
          withCredentials: true
        });
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        setError('Failed to fetch profile');
        console.error('Error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile || {});
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      // Validate password change if new password is provided
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        if (!passwordData.currentPassword) {
          setError('Current password is required to set a new password');
          return;
        }
      }

      const response = await axios.put<UserProfile>(
        'http://localhost:5000/user/profile',
        {
          ...editedProfile,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setError('');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update profile');
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:5000/user/profile', {
          withCredentials: true
        });
        dispatch(logout());
        navigate('/login');
      } catch (error: any) {
        setError(error.response?.data?.error || 'Failed to delete account');
        console.error('Error:', error);
      }
    }
  };

  if (!profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="back-button">
        <IoMdArrowRoundBack onClick={() => navigate('/home')} />
      </div>
      <h1>Profile Settings</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editedProfile.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedProfile.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={editedProfile.gender || ''} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={editedProfile.date_of_birth || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={editedProfile.phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={editedProfile.country || ''}
              onChange={handleChange}
            />
          </div>

          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="button-group">
            <button onClick={handleUpdate} className="update-btn">Update Profile</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <label>Name:</label>
            <p>{profile.name}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>
          <div className="info-group">
            <label>Gender:</label>
            <p>{profile.gender}</p>
          </div>
          <div className="info-group">
            <label>Date of Birth:</label>
            <p>{new Date(profile.date_of_birth).toLocaleDateString()}</p>
          </div>
          <div className="info-group">
            <label>Phone:</label>
            <p>{profile.phone}</p>
          </div>
          <div className="info-group">
            <label>Country:</label>
            <p>{profile.country}</p>
          </div>
          <div className="info-group">
            <label>Role:</label>
            <p>{profile.role}</p>
          </div>

          <div className="button-group">
            <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
            <button onClick={handleDelete} className="delete-btn">Delete Account</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 