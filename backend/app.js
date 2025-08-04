import express from 'express';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend
  credentials: true                // allow cookies if needed
}));

//helps read json data
app.use(express.json());
app.use('/api/auth',authRoutes);//Prefix all routes with /api 
app.use('/api/user',userRoutes)

export default app;