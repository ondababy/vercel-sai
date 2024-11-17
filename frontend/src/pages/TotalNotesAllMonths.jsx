import React from "react";
import { fetchNotesAllMonths } from "../api";

const TotalNotesAllMonths = () => {
  const [notesAllMonths, setNotessAllMonths] = React.useState(null);

  React.useEffect(() => {
    fetchNotesAllMonths()
      .then((response) => setNotessAllMonths(response)) 
      .catch((error) => console.error("Error fetching total users:", error));
  }, []);

  return (
    <div>
      <h2>Total Notes All Months</h2>
      {notesAllMonths ? (
        <ul>
          {notesAllMonths.map((month) => (
            <li key={month.month}>
              Month {month.month}: {month.count.toFixed(2)} {/* Optional: format the count */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TotalNotesAllMonths;