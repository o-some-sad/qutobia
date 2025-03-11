import express from 'express';
import {getDashboardData} from "../controllers/admin.controller.js";
import {authenticateToken} from "../middlewares/authenticateToken.js";
import {isAdmin} from "../middlewares/isAdmin.js";

const Router = express.Router();

Router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    const dashboard = await getDashboardData();
    res.status(200).json({status: 'success', data: dashboard});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
});

export default Router;