import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LockIcon from "@mui/icons-material/Lock";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SecurityIcon from "@mui/icons-material/Security";
import PolicyIcon from "@mui/icons-material/Policy";
import jwt_decode from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator"; // Import your LoadingIndicator component

const darkBackgroundStyle = {
  background: "radial-gradient(circle, #0b192f, #172a45)",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};

const tipsStyle = {
  padding: "2rem",
  color: "#94a3b8",
  fontFamily: "'Poppins', sans-serif",
};

const featureStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.5rem",
};

const iconStyle = {
  fontSize: "2.5rem",
  color: "#0ea5e9",
  marginRight: "1rem",
};

const formStyle = {
  padding: "2rem",
  backgroundColor: "#1e293b",
  borderRadius: "10px",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)",
  textAlign: "center",
  maxWidth: "400px",
  width: "100%",
};

const textFieldStyle = {
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#475569" },
    "&:hover fieldset": { borderColor: "#0ea5e9" },
    "&.Mui-focused fieldset": { borderColor: "#0ea5e9" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
};

const buttonStyle = {
  backgroundColor: "#0ea5e9",
  color: "#fff",
  "&:hover": { backgroundColor: "#0284c7" },
};

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For error message
  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar visibility
  const [touched, setTouched] = useState(false); // To track if the form was touched
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched(true); // Mark the form as touched when the user attempts to submit

    // Basic validation
    if (method === "register" && password !== confirmPassword) {
      setError("Passwords do not match!");
      setOpenSnackbar(true);
      return;
    }

    if (!username || !password || (method === "register" && !email)) {
      setError("All fields are required!");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    // Simulate loading for 2 seconds
    setTimeout(async () => {
      try {
        const data =
          method === "register"
            ? { username, email, password }
            : { username, password };

        const res = await api.post(route, data);

        if (method === "login") {
          const { access, refresh } = res.data;

          // Store tokens
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);

          // Decode and redirect based on role
          const { role } = jwt_decode(access);
          role === "admin" ? navigate("/admin") : navigate("/home");
        } else {
          navigate("/login");
        }
      } catch (error) {
        setError(
          error.response?.data?.detail || "An error occurred. Please try again."
        );
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <>
      {loading && <LoadingIndicator />} {/* Show Loading Indicator when loading */}
      <div style={darkBackgroundStyle}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box style={tipsStyle}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  CryptoNotes Features:
                </Typography>
                <Box style={featureStyle}>
                  <LockIcon style={iconStyle} />
                  <Typography>
                    <strong>Data Encryption:</strong> Protects sensitive data by
                    encoding it securely.
                  </Typography>
                </Box>
                <Box style={featureStyle}>
                  <PrivacyTipIcon style={iconStyle} />
                  <Typography>
                    <strong>Differential Privacy:</strong> Ensures individual
                    data cannot be distinguished.
                  </Typography>
                </Box>
                <Box style={featureStyle}>
                  <SecurityIcon style={iconStyle} />
                  <Typography>
                    <strong>Cryptography:</strong> Utilizes advanced algorithms
                    to secure communication.
                  </Typography>
                </Box>
                <Box style={featureStyle}>
                  <PolicyIcon style={iconStyle} />
                  <Typography>
                    <strong>Policy Implications:</strong> Supports compliance
                    with global data protection laws.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={formStyle}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: 2,
                    color: "#0ea5e9",
                  }}
                >
                  {name}
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    sx={textFieldStyle}
                    error={touched && !username} // Show error after submit attempt
                    helperText={touched && !username && "Username is required"}
                  />
                  {method === "register" && (
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{ ...textFieldStyle, marginTop: "1rem" }}
                      error={touched && !email} // Show error after submit attempt
                      helperText={touched && !email && "Email is required"}
                    />
                  )}
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ ...textFieldStyle, marginTop: "1rem" }}
                    error={touched && !password} // Show error after submit attempt
                    helperText={touched && !password && "Password is required"}
                  />
                  {method === "register" && (
                    <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    sx={{ ...textFieldStyle, marginTop: "1rem" }}
                    error={touched && (!confirmPassword || password !== confirmPassword)} // Check if confirmPassword is empty or doesn't match password
                    helperText={
                        touched && (!confirmPassword
                        ? "Confirm Password is required"
                        : password !== confirmPassword
                        ? "Passwords do not match"
                        : ""
                        )
                    }
                    />
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    sx={{ ...buttonStyle, marginTop: "1.5rem" }}
                  >
                    {name}
                  </Button>
                </form>
                <Typography sx={{ marginTop: 2, color: "#94a3b8" }}>
                  {method === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Button
                    variant="text"
                    onClick={() =>
                      navigate(method === "login" ? "/register" : "/login")
                    }
                    sx={{ color: "#0ea5e9" }}
                  >
                    {method === "login" ? "Sign Up" : "Sign In"}
                  </Button>
                </Typography>
                <Divider sx={{ marginTop: 2, color: "#94a3b8" }}>Or</Divider>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      <GoogleIcon />
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      <FacebookIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Form;
