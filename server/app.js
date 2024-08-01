const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

const CITY_ID = "YOUR_CITY_ID";

require("dotenv").config({ path: ".local/.env" });

const { PORT, API_KEY } = process.env;

const fetchWeatherData = async () => {
  try {
    const lat = "37.5683";
    const lng = "126.9778";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}&lang=kr`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");

  const sendWeatherData = async () => {
    const data = await fetchWeatherData();
    if (data) {
      socket.emit("weatherUpdate", data);
    }
  };

  sendWeatherData();

  const intervalId = setInterval(sendWeatherData, 80000); // 1분마다 데이터 전송

  socket.on("disconnect", () => {
    clearInterval(intervalId);
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
