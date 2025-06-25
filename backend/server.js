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
// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL||'*', // Allow all origins, adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json()); // Parse JSON bodies

// Connect to the database
connectDB();

// Routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/expense', expenseRouter);
app.use('/api/v1/income', incomeRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

