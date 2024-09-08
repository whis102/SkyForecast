import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, TextField, Typography, Grid } from '@mui/material';
import './app.scss';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [background, setBackground] = useState('');

  const apiKey = '895284fb2d2c50a520ea537456963d9c';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  const geoWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  // Fetch weather data
  function fetchWeatherData(url) {
    axios
      .get(url)
      .then((response) => {
        console.log('Weather Data:', response.data);
        setData(response.data);
        updateBackground(response.data);
      })
      .catch((error) => {
        console.log('Error fetching weather data:', error);
      });
  }

  // Search for a location's weather data
  function searchLocation(event) {
    if (event.key === 'Enter') {
      fetchWeatherData(weatherUrl);
      setLocation('');
    }
  }

  // Update background based on weather data
  function updateBackground(data) {
    const code = data.weather ? data.weather[0].id : null;
    const isDay = data.weather && data.weather[0].icon.includes('d');

    console.log('Weather Code:', code);
    console.log('Is Day:', isDay);

    // Update background based on weather code and time of day
    if (code === 800) {
      setBackground(isDay ? '/assets/day/clear.jpg' : '/assets/night/clear.jpg');
    } else if ([801, 802, 803, 804].includes(code)) {
      setBackground(isDay ? '/assets/day/cloudy.jpg' : '/assets/night/cloudy.jpg');
    } else if (code >= 500 && code <= 531) {
      setBackground(isDay ? '/assets/day/rainy.jpg' : '/assets/night/rainy.jpg');
    } else {
      setBackground(isDay ? '/assets/day/snowy.jpg' : '/assets/night/snowy.jpg');
    }
  }

  // Automatically fetch weather data based on geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
    }
  }, []);

  // Fetch data when lat/lon changes
  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(geoWeatherUrl);
    }
  }, [lat, lon]);

  return (
    <Box
      className="app"
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Container className="container">
        <Box className="search">
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
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#fff' },
              },
            }}
          />
        </Box>

        <Box className="top">
          <Typography variant="h4" className="location">
            {data.name}
          </Typography>

          <Typography variant="h1" className="temp">
            {data.main ? `${data.main.temp.toFixed()}°C` : null}
          </Typography>

          {data.weather && (
            <Box className="weather">
              <img
                src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
              <Typography variant="h6" className="description">
                {data.weather[0].main}
              </Typography>
            </Box>
          )}
        </Box>

        {data.name && (
          <Grid container className="bottom" spacing={2}>
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
