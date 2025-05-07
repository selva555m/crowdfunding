const express = require("express");
const path = require("path");
const connect = require("./config/connection");
const routers = require("./routers/routers");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
require("dotenv").config();

connect();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve campaign images correctly
app.use("/campaign-uploads", express.static("src/CampaignUploads"));
app.use("/uploads", express.static("src/Uploads"));
app.use("/campaign-files", express.static("src/CampaignFiles"));

// API Routes
app.use("/v1", routers);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is Running Successfully on port: ${port}`); 
});