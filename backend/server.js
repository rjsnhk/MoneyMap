const express=require('express');
const connectDB = require('./config/db');
const expenseRouter = require('./routes/expenseRoutes');
const authRouter=require('./routes/authRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
const incomeRouter = require('./routes/incomeRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const path = require('path');
const transactionRouter = require('./routes/transactionRoutes');
const axios=require("axios");
// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL||'*', // Allow all origins, adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json()); // Parse JSON bodies

// Connect to the database
connectDB();

const url = `https://mm-backend-doq0.onrender.com`;
const interval = 30000; // 30 seconds

let lastReloadTime = "Not yet reloaded";

function reloadWebsite() {
  axios
    .get(url)
    .then(() => {
      lastReloadTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      console.log(`✅ Website reloaded at ${lastReloadTime}`);
    })
    .catch((error) => {
      console.error(`❌ Error reloading website: ${error.message}`);
    });
}

// call it repeatedly
setInterval(reloadWebsite, interval);

// optional: trigger once on startup
reloadWebsite();

app.get("/", (req, res) => {
  res.send(`Last time website reloaded: ${lastReloadTime}`);
});

// Routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/expense', expenseRouter);
app.use('/api/v1/income', incomeRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/transaction', transactionRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

