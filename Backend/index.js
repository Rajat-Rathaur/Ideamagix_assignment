import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './connector/dbConnection.js'; // Import the MongoDB connection function
import userRouter from './routes/routes.js'; // Import User Routes
import isLoggedIn from './middleware/reqAuth.js'; // Import the isLoggedIn middleware if modularized
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';



dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Get the current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173'], // Add your allowed origins
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret', // Use an environment variable for better security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
  })
);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Project API');
});

// Protected Route Example
app.get('/auth/protected', isLoggedIn, (req, res) => {
  const name = req.user?.displayName || 'Guest'; // Safely access displayName
  res.send(`Hello ${name}`);
});

// Routes
app.use('/user', userRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

