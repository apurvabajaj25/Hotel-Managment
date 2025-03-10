const express = require('express') // Express for routing and middleware management
const path = require('path') // Path to handle file paths
const app = express()
const cors=require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        // ✅ Allow external images (postimg, Google Maps, etc.)
        imgSrc: ["'self'", "data:", "https://i.postimg.cc", "https://maps.googleapis.com"],

        // ✅ Allow external scripts (Google Maps API, unpkg, etc.)
        scriptSrc: ["'self'", "https://unpkg.com", "https://maps.googleapis.com"],
        scriptSrcElem: ["'self'", "https://unpkg.com", "https://maps.googleapis.com"],

        // ✅ Allow external styles (Google Fonts, Cloudflare, etc.)
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],

        // ✅ Allow font files (Google Fonts)
        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        // ✅ Allow other resources if needed
        connectSrc: ["'self'", "https://maps.googleapis.com"],
      },
    },
  })
);

const morgan = require('morgan'); // Logging middleware
const rateLimit = require('express-rate-limit'); // Import the package

// Define a rate limit: Allow 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    headers: true, // Send rate limit info in headers
});

// Apply the rate limiter to all API routes
app.use('/api', limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
// const cors=require(cors)
const PORT = 8080
// Import middlewares
const logger = require('./middleware/logger') // Import logger middleware
const errorHandler = require('./middleware/errorhandler') // Import error handler middleware
// Middleware to handle JSON and URL-encoded data in POST requests
app.use(express.json()) // To parse JSON bodies
app.use(express.urlencoded({ extended: true })) // To parse URL-encoded data
// Use logger middleware for all incoming requests
app.use(logger) // Log each request
// Serve static files (HTML, CSS, JS) from the /public directory
app.use(express.static(path.join(__dirname, 'public')))
// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes') // Import the API routes for login and register functionality
app.use('/api', apiRoutes) // Mount the API routes on /api path
// Serve login.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')) // Serve the login page at root URL
})
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html')) // Serve the login page at root URL
})
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html')) // Serve the login page at root URL
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')) // Serve the login page at root URL
})
app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'rooms.html')) // Serve the login page at root URL
})
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'blog.html')) // Serve the login page at root URL
})

// Serve dashboard.html when user is authenticated
app.get('/api/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')) // Serve the dashboard HTML file
})
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')) // Serve the dashboard HTML file
})
// Serve register.html when user needs to register
app.get('/api/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html')) // Serve the register HTML file
})
// Use error handler middleware for catching and handling errors
app.use(errorHandler) // Handle errors globally
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`erver is running at http://localhost:${PORT}`)
})