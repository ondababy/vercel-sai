import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, LinearProgress, Collapse, Slider, IconButton, Box, Container
} from '@mui/material';
import { Dashboard as DashboardIcon, FileDownload as FileDownloadIcon, PictureAsPdf as PictureAsPdfIcon, CameraAlt as CameraAltIcon, Brightness6 as Brightness6Icon } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchTotalNotes, fetchTotalUsers, fetchNotesAllMonths, fetchUsersAllMonths } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const googleDocsColors = {
  blue: '#1a73e8',
  green: '#34a853',
};

function AdminDashboard() {
  const [totalNotes, setTotalNotes] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [notesAllMonths, setNotesAllMonths] = useState([]);
  const [usersAllMonths, setUsersAllMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [openCharts, setOpenCharts] = useState(false);
  const [brightness, setBrightness] = useState(100);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return Math.min(prev + 10, 100);
      });
    }, 500);

    fetchTotalNotes().then(response => setTotalNotes(response.total_notes)).catch(console.error);
    fetchTotalUsers().then(response => setTotalUsers(response.total_users)).catch(console.error);
    fetchNotesAllMonths().then(response => setNotesAllMonths(response || [])).catch(console.error);
    fetchUsersAllMonths().then(response => setUsersAllMonths(response || [])).catch(console.error);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  const handleToggleCharts = () => setOpenCharts(!openCharts);

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

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <Box component="aside" sx={{ width: 240, bgcolor: 'primary.dark', py: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" startIcon={<DashboardIcon />} onClick={() => navigate('/admin')} fullWidth>Dashboard</Button>
        <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExportData} fullWidth>Export Data</Button>
        <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF} fullWidth>Export PDF</Button>
        <IconButton color="inherit" onClick={() => setBrightness(brightness === 100 ? 50 : 100)}>
          <Brightness6Icon />
        </IconButton>
        <Slider value={brightness} onChange={(e, val) => setBrightness(val)} min={0} max={200} />
      </Box>

      <Container maxWidth="lg" sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">Loading Dashboard...</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderColor: 'primary.light' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Total Notes</Typography>
                  <Typography variant="h4" color="primary">{totalNotes}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderColor: 'primary.light' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Total Users</Typography>
                  <Typography variant="h4" color="primary">{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleToggleCharts} fullWidth>{openCharts ? 'Hide Charts' : 'Show Charts'}</Button>
              <Collapse in={openCharts}>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderColor: 'primary.light' }}>
                      <CardContent>
                        <Typography variant="h6">Total Notes Chart</Typography>
                        <BarChart xAxis={notesChartData.xAxis} series={notesChartData.series} height={200} width={350} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderColor: 'primary.light' }}>
                      <CardContent>
                        <Typography variant="h6">Total Users Chart</Typography>
                        <BarChart xAxis={usersChartData.xAxis} series={usersChartData.series} height={200} width={350} />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default AdminDashboard;
