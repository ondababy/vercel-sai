import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import { Shield, Key, CheckCircle } from "@mui/icons-material";

const Landing = () => {
  const navigate = useNavigate();

  const handleStartWritingClick = () => {
    navigate("/register");
  };

  const features = [
    {
      icon: <Shield fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "End-to-End Encryption",
      description: "Your notes are encrypted before they leave your device.",
    },
    {
      icon: <Key fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "Zero-Knowledge",
      description: "We can't read your notes, even if we wanted to.",
    },
    {
      icon: <CheckCircle fontSize="large" sx={{ color: "#0b192f" }} />,
      title: "Always Available",
      description: "Access your notes anytime, anywhere, on any device.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #0b192f, #172a45)",
        padding: "3rem 0",
        overflow: "hidden",
        position: "relative",
        color: "#ffffff", // Default text color
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          marginBottom: "4rem",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(to right, #ffffff, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            letterSpacing: "1px",
            fontSize: "3.5rem",
          }}
        >
          Your Thoughts, Secured
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "2rem",
            color: "rgba(255, 255, 255, 0.8)", // Softer white for readability
            fontSize: "1.1rem",
          }}
        >
          Write freely knowing your notes are protected with military-grade encryption.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleStartWritingClick}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "30px",
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            background: "#42a5f5",
            color: "#0b192f", // Dark blue for contrast
            boxShadow: "0px 4px 15px rgba(66, 165, 245, 0.4)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 8px 20px rgba(66, 165, 245, 0.6)",
            },
          }}
        >
          Start Writing Now
        </Button>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ zIndex: 1, position: "relative" }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "2rem",
                  borderRadius: "20px",
                  backdropFilter: "blur(10px)",
                  background: `rgba(255, 255, 255, 0.2)`,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0px 8px 30px rgba(255, 255, 255, 0.2)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 12px 40px rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
