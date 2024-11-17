
import React from "react";
import { fetchUsersAllMonths } from "../api";

const TotalUsersAllMonths = () => {
  const [usersAllMonths, setUsersAllMonths] = React.useState(null);

  React.useEffect(() => {
    fetchUsersAllMonths()
      .then((response) => setUsersAllMonths(response))  // Corrected to handle the data properly
      .catch((error) => console.error("Error fetching total users:", error));
  }, []);

  return (
    <div>
      <h2>Total Users All Months</h2>
      {usersAllMonths ? (
        <ul>
          {usersAllMonths.map((month) => (
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

export default TotalUsersAllMonths;