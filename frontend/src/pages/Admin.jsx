import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Box, Container, Snackbar, Alert, Switch
} from '@mui/material';
import { FileDownload as FileDownloadIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import { jsPDF } from 'jspdf';
import { fetchTotalNotes, fetchTotalUsers, fetchNotesAllMonths, fetchUsersAllMonths } from '../api';
import '../styles/admin.css';

const googleDocsColors = {
  blue: '#1a73e8',
  green: '#34a853',
};

const AdminDashboard = () => {
  const [totalNotes, setTotalNotes] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [notesAllMonths, setNotesAllMonths] = useState([]);
  const [usersAllMonths, setUsersAllMonths] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    getNotes();
    getUsers();
  }, []);

  const getNotes = () => {
    fetchTotalNotes().then(response => setTotalNotes(response.total_notes)).catch(console.error);
    fetchNotesAllMonths().then(response => setNotesAllMonths(response || [])).catch(console.error);
  };

  const getUsers = () => {
    fetchTotalUsers().then(response => setTotalUsers(response.total_users)).catch(console.error);
    fetchUsersAllMonths().then(response => setUsersAllMonths(response || [])).catch(console.error);
  };

  const handleExportData = () => {
    const csvData = `Total Notes,${totalNotes}\nTotal Users,${totalUsers}\n`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dashboard_data.csv';
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Admin Dashboard Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Notes: ${totalNotes}`, 20, 30);
    doc.text(`Total Users: ${totalUsers}`, 20, 40);
    doc.save('dashboard_report.pdf');
  };

  const notesChartData = {
    xAxis: [{ scaleType: 'band', data: notesAllMonths.map(month => `Month ${month.month}`) }],
    series: [{ data: notesAllMonths.map(month => month.count), color: googleDocsColors.blue }]
  };

  const usersChartData = {
    xAxis: [{ scaleType: 'band', data: usersAllMonths.map(month => `Month ${month.month}`) }],
    series: [{ data: usersAllMonths.map(month => month.count), color: googleDocsColors.green }]
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0b192f' : '#f0f4f8',
      color: darkMode ? '#fff' : '#333',
      transition: 'background-color 0.3s, color 0.3s',
      padding: 4,
    }}>
      <Container maxWidth="lg">
        {/* Dark Mode Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="primary"
            inputProps={{ "aria-label": "dark mode toggle" }}
          />
        </Box>

        <Grid container spacing={4} sx={{ marginBottom: 3 }}>
          {/* Total Notes and Total Users Cards */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Notes</Typography>
                <Typography variant="h4">{totalNotes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Users</Typography>
                <Typography variant="h4">{totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Notes Chart</Typography>
                <BarChart xAxis={notesChartData.xAxis} series={notesChartData.series} height={300} width={450} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Users Chart</Typography>
                <BarChart xAxis={usersChartData.xAxis} series={usersChartData.series} height={300} width={450} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportData}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' },
              flex: 1,
              margin: '0 1rem',
            }}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' },
              flex: 1,
              margin: '0 1rem',
            }}
          >
            Export PDF
          </Button>
        </Grid>
      </Container>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
