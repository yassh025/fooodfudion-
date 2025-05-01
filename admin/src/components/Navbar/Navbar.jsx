import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove auth token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <img className='logo' src={assets.logo} alt="Logo" />
        <h2>Admin Panel</h2> {/* Add Admin Panel Title */}
      </div>
      <div className="navbar-right">
        <img className='profile' src={assets.profile_image} alt="Profile" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button> {/* Add Logout Button */}
      </div>
    </div>
  );
};

export default Navbar;
