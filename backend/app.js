import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import routes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
// app.use('/routes/upload', uploadRoutes);
app.use('/routes/calculate', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
