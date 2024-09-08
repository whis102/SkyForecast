import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, TextField, Typography, Grid } from '@mui/material';
import './app.scss';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const apiKey = '895284fb2d2c50a520ea537456963d9c';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  const geoWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const fetchWeatherData = (url) => {
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
    }).catch((error) => {
      console.log('Error fetching weather data:', error);
    });
  };

  // Fetch weather data based on user input
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData(weatherUrl);
      setLocation('');
    }
  };

  // Automatically fetch weather data based on geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(geoWeatherUrl);
    }
  }, [lat, lon]);

  return (
    <Box className="app">
      <Container className="search" sx={{ textAlign: 'center', padding: '1rem' }}>
        <TextField
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          label="Enter Location"
          variant="outlined"
          fullWidth
          sx={{
            input: { color: '#f8f8f8' },
            label: { color: '#f8f8f8' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' },
              '&:hover fieldset': { borderColor: '#fff' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
          }}
        />
      </Container>

      <Container className="container">
        <Box className="top">
          <Typography variant="h4" className="location" sx={{ textAlign: 'center' }}>
            {data.name}
          </Typography>

          <Typography variant="h1" className="temp" sx={{ textAlign: 'center' }}>
            {data.main ? `${data.main.temp.toFixed()}°C` : null}
          </Typography>

          <Typography variant="h6" className="description" sx={{ textAlign: 'center' }}>
            {data.weather ? data.weather[0].main : null}
          </Typography>
        </Box>

        {data.name !== undefined && (
          <Grid container className="bottom" spacing={2} sx={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px' }}>
            <Grid item xs={4}>
              <Typography variant="h6" className="bold">
                {data.main ? `${data.main.feels_like.toFixed()}°C` : null}
              </Typography>
              <Typography variant="body1">Feels Like</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" className="bold">
                {data.main ? `${data.main.humidity}%` : null}
              </Typography>
              <Typography variant="body1">Humidity</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" className="bold">
                {data.wind ? `${data.wind.speed.toFixed()} m/s` : null}
              </Typography>
              <Typography variant="body1">Wind Speed</Typography>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;