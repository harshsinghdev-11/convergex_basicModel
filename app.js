const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

let sensorData = { temperature: 0, humidity: 0 };


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/data", (req, res) => {
  const { temperature, humidity,soilMoisture } = req.body;
  sensorData = { temperature, humidity , soilMoisture};
  io.emit("updateData", sensorData);
  res.sendStatus(200);
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("updateData", sensorData);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
