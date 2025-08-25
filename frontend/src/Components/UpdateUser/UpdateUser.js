import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

function UpdateUser() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate(); // ✅ fixed name
  const { id } = useParams(); // ✅ destructure safely

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/users/${id}`, {
        name: String(inputs.name),
        gmail: String(inputs.gmail),
        age: String(inputs.age),
        address: String(inputs.address),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate('../dashbord')); // ✅ fixed navigate usage
  };

  return (
    <div>
      <form
        onSubmit={handlesubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          width: "300px",
          margin: "auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Information</h2>

        <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          value={inputs.name || ''}
          required
          style={{
            width: "100%", padding: "8px", marginBottom: "15px",
            border: "1px solid #ccc", borderRadius: "4px"
          }}
        />

        <label htmlFor="gmail" style={{ display: "block", marginBottom: "5px" }}>Gmail:</label>
        <input
          type="email"
          id="gmail"
          name="gmail"
          onChange={handleChange}
          value={inputs.gmail || ''}
          required
          style={{
            width: "100%", padding: "8px", marginBottom: "15px",
            border: "1px solid #ccc", borderRadius: "4px"
          }}
        />

        <label htmlFor="age" style={{ display: "block", marginBottom: "5px" }}>Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          onChange={handleChange}
          value={inputs.age || ''}
          required
          min="1"
          style={{
            width: "100%", padding: "8px", marginBottom: "15px",
            border: "1px solid #ccc", borderRadius: "4px"
          }}
        />

        <label htmlFor="address" style={{ display: "block", marginBottom: "5px" }}>Address:</label>
        <textarea
          id="address"
          name="address"
          onChange={handleChange}
          value={inputs.address || ''}
          required
          rows="3"
          style={{
            width: "100%", padding: "8px", marginBottom: "15px",
            border: "1px solid #ccc", borderRadius: "4px"
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            width: "100%", padding: "10px", backgroundColor: "#007bff",
            color: "white", border: "none", borderRadius: "4px", cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
