import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import uploadRoutes from './routes/upload-routes.js';

const app = express();

app.use(cors());
app.use('/routes/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
