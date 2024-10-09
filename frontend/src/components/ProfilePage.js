// ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage

        try {
            const response = await fetch('http://127.0.0.1:5000/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token in the request
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const data = await response.json();
            setUserData(data); // Set the fetched user data
        } catch (error) {
            setError(error.message);
            localStorage.removeItem('token'); // Remove the token if there's an error
            navigate('/login'); // Redirect to login page if there's an error
        }
    };

    useEffect(() => {
        fetchUserProfile(); // Fetch user profile when the component mounts
    }, []);

    return (
        <div>
            <h2>User Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userData ? (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    {/* Add more user details as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
