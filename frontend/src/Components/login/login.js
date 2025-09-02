import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      console.log('Sending login request:', { email, password }); 
      const res = await axios.post('http://localhost:5000/users/login', { email, password });

      if (res.data && res.data.user && res.data.user.name) {          //add seassion
        sessionStorage.setItem('username', res.data.user.name);
      }
      console.log('Login response:', res.data); // Debug
      localStorage.setItem('token', res.data.token);
      const role = res.data.role;
      console.log('Navigating to:', role === 'admin' ? '/admin-dashboard' : `/${role}-dashboard`); 
      if (role === 'pending') {
        navigate('/waiting');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(`/${role}-dashboard`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err.response?.data || err.message); // Debug
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;