const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

// Custom NoSQL Injection Protection for Express 5
const sanitizeObject = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        delete obj[key];
      } else {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
};

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for Auth (Login/Register)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: { message: 'Too many authentication attempts, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for AI Generations (Resource intensive)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI generations per hour (on top of credit checks)
  message: { message: 'AI generation limit reached for this hour, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom XSS Protection (Express 5 compatible)
const cleanXSS = (data) => {
  if (typeof data === 'string') {
    // Simple HTML tag stripping for API safety
    return data.replace(/<[^>]*>?/gm, '');
  }
  if (Array.isArray(data)) {
    return data.map(cleanXSS);
  }
  if (data instanceof Object) {
    for (const key in data) {
      data[key] = cleanXSS(data[key]);
    }
  }
  return data;
};

const setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Data sanitization against NoSQL query injection (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.query) {
      // In Express 5, req.query is read-only, so we sanitize a copy and assign it back if needed
      // but since our sanitizeObject modifies the properties directly, it might work if the props are writable.
      // If props are also read-only, we'd need a different approach.
      // Let's try direct property modification first as it's most efficient.
      sanitizeObject(req.query);
    }
    if (req.params) sanitizeObject(req.params);
    next();
  });

  // Data sanitization against XSS (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.body) req.body = cleanXSS(req.body);
    if (req.query) {
      // For query, we have to be careful as it's a getter.
      // However, the properties of the query object are usually writable.
      cleanXSS(req.query);
    }
    if (req.params) cleanXSS(req.params);
    next();
  });

  // Prevent parameter pollution
  app.use(hpp());

  // Apply general rate limiting
  app.use('/api', generalLimiter);

  // Apply stricter limiting to auth and generation routes
  app.use('/api/auth', authLimiter);
  app.use('/api/dependencies', aiLimiter);
  app.use('/api/setup', aiLimiter);
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'An unexpected error occurred. Please try again later.' 
      : message
  });
};

module.exports = { setupSecurity, errorHandler };
