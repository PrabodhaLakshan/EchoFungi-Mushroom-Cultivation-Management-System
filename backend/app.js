const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./Routes/UserRoutes');
const sprayrouter =require("./Routes/sprayRoutes")
const iotRouter =require("./Routes/IoTRoutes")
const temperatureSettingRouter =require("./Routes/TemperatureSettingRoutes")
dotenv.config();

const app = express();


app.use("/sprays",sprayrouter);
app.use("/iot",iotRouter);
app.use("/api/temperatureSetting",temperatureSettingRouter);
// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
  credentials: true, // Allow cookies/auth headers if needed
}));

// Parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));



 

// Routes
app.use('/users', userRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));