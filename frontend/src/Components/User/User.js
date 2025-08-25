import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function User(props) {
  const history = useNavigate();

  if (!props.User) {
    return <div>Loading user data...</div>;
  }

  const { _id, name, gmail, age, address } = props.User;

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/users/${_id}`)
      .then(res => res.data)
      .then(() => {
        if (props.onDelete) {
          props.onDelete(); // ✅ Trigger refresh in parent
        } else {
          history("/dashbord"); // ✅ fallback if no refresh function passed
        }
      });
  }

  return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h1 className="text-xl font-bold text-white">User Profile</h1>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* ID Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-500">ID:</span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{_id}</span>
        </div>
        
        {/* Name */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold text-gray-800">{name}</p>
          </div>
        </div>
        
        {/* Email */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{gmail}</p>
          </div>
        </div>
        
        {/* Age */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-semibold text-gray-800">{age} years</p>
          </div>
        </div>
        
        {/* Address */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-gray-800">{address}</p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="bg-gray-50 px-6 py-4 flex space-x-3">
        <Link to={`/Users/${_id}`} className="flex-1">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Update</span>
          </button>
        </Link>
        
        <button 
          onClick={deleteHandler}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default User;
