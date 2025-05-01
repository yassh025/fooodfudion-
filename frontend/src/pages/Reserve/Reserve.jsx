// ... all your imports remain unchanged
import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./Reserve.css";

const Reserve = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    partySize: 1,
    celebrationType: "",
    tableNo: "",
    areaPreference: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(40);
    doc.text("FoodFusion", 50, 100, null, null, "center");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);

    const content = `
      Reservation Details:
      Name: ${formData.name}
      Date: ${formData.date}
      Time: ${formData.time}
      Party Size: ${formData.partySize}
      Table No: ${formData.tableNo}
      Area Preference: ${formData.areaPreference}
      Celebration Type: ${formData.celebrationType ? formData.celebrationType : "None"}
    `;
    doc.text(content, 20, 140);

    const qrCodeData = `https://www.restaurant.com/visit?reservationID=${new Date().getTime()}`;
    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) throw err;

      doc.addImage(url, "PNG", 150, 180, 50, 50);
      doc.setFontSize(12);
      doc.text("Show this QR code at the restaurant upon visiting.", 150, 250);

      doc.save(`Reservation_${formData.name}_${new Date().toLocaleDateString()}.pdf`);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.time || formData.partySize <= 0 || !formData.tableNo || !formData.areaPreference) {
      setError("All fields (except Celebration Type) are required!");
      return;
    }

    setError("");
    setLoading(true);
    setSuccessMessage("");

    try {
      // ================================
      // 👇 Original backend call (disabled)
      // await axios.post("http://localhost:4000/api/reservations", formData);
      
      // ✅ Mocked backend delay simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // ================================

      setSuccessMessage(`🎉 Reservation confirmed! ${formData.celebrationType ? `Celebrating: ${formData.celebrationType}` : ''}`);
      generatePDF();

      setFormData({
        name: "",
        date: "",
        time: "",
        partySize: 1,
        celebrationType: "",
        tableNo: "",
        areaPreference: "",
      });
    } catch (error) {
      setError("There was an error with your reservation. Please try again.");
      console.error("Error making reservation:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reserve-container">
      <h2>Reserve Your Table 🍽️</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Party Size</label>
          <input type="number" name="partySize" value={formData.partySize} onChange={handleChange} min="1" required />
        </div>

        <div className="form-group">
          <label>Table Number</label>
          <input type="text" name="tableNo" value={formData.tableNo} onChange={handleChange} placeholder="Enter table number" required />
        </div>

        <div className="form-group">
          <label>Area Preference</label>
          <select name="areaPreference" value={formData.areaPreference} onChange={handleChange} required>
            <option value="">Select Area</option>
            <option value="AC">AC Area</option>
            <option value="Non-AC">Non-AC Area</option>
            <option value="Private Room">Private Room</option>
            <option value="Backyard">Backyard View</option>
          </select>
        </div>

        <div className="form-group">
          <label>Celebration Type (Optional)</label>
          <select name="celebrationType" value={formData.celebrationType} onChange={handleChange}>
            <option value="">🎈 None</option>
            <option value="Birthday">🎂 Birthday</option>
            <option value="Anniversary">💖 Anniversary</option>
            <option value="Business Meeting">💼 Business Meeting</option>
            <option value="Other">🎊 Other</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <div className="loading-spinner"></div> : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default Reserve;