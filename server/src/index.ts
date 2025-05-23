import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, '../../dist')));

// Routes
app.use('/api/auth', authRoutes);

// Add /api/alerts route
app.get('/api/alerts', (req, res) => {
  res.json([]); // Return an empty array or your real alerts data
});

// Catch-all handler to serve React's index.html for any unknown route (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');
  ws.send(JSON.stringify({ type: 'welcome', message: 'WebSocket connected!' }));
  // Example: broadcast to all clients
  // wss.clients.forEach(client => client.send(...));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (with WebSocket support)`);
}); 