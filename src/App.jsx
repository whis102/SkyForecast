import { useState } from "react";
import "./app.scss";

import axios from "axios";
import { Box, Typography } from "@mui/material";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const API_KEY = "fceb739b11cfed510276baf19fbd0937";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

  function searchLocation(event) {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        setLocation("");
      });
    }
  }

  return (
    <Box className="app">
      <div className="search">
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="E.g Hanoi, London"
        />
      </div>

      <div className="container">
        <div className="top">
          <div className="location">
            <Typography variant="h4">SkyForecast</Typography>
          </div>

          <div className="location">
            <Typography variant="h4">{data.name}</Typography>
          </div>
          <div className="temp">
            <Typography variant="h2" component={"h2"}>
              {data.main ? data.main.temp : null}&#176;F
            </Typography>
          </div>
          <div className="description">
            <p>{data.weather[0].main}</p>
          </div>
        </div>
        <div className="bottom">
          <div className="humidity">
            <Typography variant="h2" component={"h2"}>
              {data.main ? data.main.humidity : null}%
            </Typography>
          </div>

          <div className="wind">
            <Typography variant="h2" component={"h2"}>
              {data.wind ? data.wind.speed : null}km/h
            </Typography>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default App;
