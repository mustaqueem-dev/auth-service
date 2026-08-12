import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// 1. Global Security Middlewares
app.use(helmet()); // Adds security HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON payloads

// 2. Health Check Route (API Gateway/Load Balancers ko batane ke liye ki service zinda hai)
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, service: 'Auth Service', status: 'Active' });
});

// 3. Mount Routes
app.use('/api/auth', authRoutes);

// 4. Handle 404 (Unknown Routes)
app.use(notFoundHandler);

// 5. Global Error Handling (Must be the last middleware)
app.use(globalErrorHandler);

export default app;