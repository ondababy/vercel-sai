// src/pages/TotalUsers.js

import React, { useEffect, useState } from 'react';
import { fetchTotalUsers } from '../api'; // Import the API function

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    fetchTotalUsers()
      .then((response) => setTotalUsers(response.total_users)) // Assuming response contains 'total_users'
      .catch((error) => console.error('Error fetching total users:', error));
  }, []);

  return (
    <div>
      <h2>Total Users</h2>
      {totalUsers ? <p>{totalUsers}</p> : <p>Loading...</p>}
    </div>
  );
};

export default TotalUsers;