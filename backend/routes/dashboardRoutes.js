const express=require('express');
const dashboardRouter = express.Router();
const {protect} = require("../middleware/authMiddleware");
const { getDashboardData } = require('../controllers/dashboardController');

dashboardRouter.get("/",protect, getDashboardData);

module.exports = dashboardRouter;