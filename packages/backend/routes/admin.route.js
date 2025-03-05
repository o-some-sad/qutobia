import express from 'express';
import {getDashboardData} from "../controllers/admin.controller.js";

const Router = express.Router();

Router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await getDashboardData();
    res.status(200).json({status: 'success', data: dashboard});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
});

export default Router;