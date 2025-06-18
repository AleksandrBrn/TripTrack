import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.js';

const app = express();

app.use(cors());
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

