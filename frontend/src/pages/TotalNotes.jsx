import React, { useEffect, useState } from 'react';
import { fetchTotalNotes } from '../api'; // Import the API function

const TotalNotes = () => {
  const [totalNotes, setTotalNotes] = useState(null);

  useEffect(() => {
    fetchTotalNotes()
      .then((response) => setTotalNotes(response.total_notes)) // Assuming response contains 'total_notes'
      .catch((error) => console.error('Error fetching total notes:', error));
  }, []);

  return (
    <div>
      <h2>Total Notes</h2>
      {totalNotes ? <p>{totalNotes}</p> : <p>Loading...</p>}
    </div>
  );
};

export default TotalNotes;