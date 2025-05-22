import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Routes
app.use('/api/auth', authRoutes);

// Add /api/alerts route
app.get('/api/alerts', (req, res) => {
  res.json([]); // Return an empty array or your real alerts data
});

// Catch-all handler to serve React's index.html for any unknown route (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Start server without database (for production or demo)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (no DB connection)`);
}); 