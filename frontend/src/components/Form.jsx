import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import jwt_decode from "jwt-decode";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");  // Added email state for registration
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register"; // Dynamically set form title

    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent default form submission
        setLoading(true);

        try {
            const data = method === "register" ? { username, password, email } : { username, password }; // Prepare data based on method
            const res = await api.post(route, data);

            console.log(res.data); // Debug: Check the response data from the API

            if (method === "login") {
                // Save the tokens to localStorage
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                // Decode the token to get the role
                const decodedToken = jwt_decode(res.data.access);
                const userRole = decodedToken.role;

                // Debug: Check decoded token
                console.log(decodedToken); 

                // Redirect based on role
                if (userRole === "admin") {
                    navigate("/admin"); // Redirect to admin page if the role is 'admin'
                } else {
                    navigate("/");  // Redirect to home page if the role is not 'admin'
                }
            } else {
                navigate("/login");  // Redirect to login page if registration is successful
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            alert(error.response?.data?.detail || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            {method === "register" && (
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
            )}
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit" disabled={loading}>
                {loading ? "Loading..." : name}
            </button>
        </form>
    );
}

export default Form;
