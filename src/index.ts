import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerSpec from './swagger';
import authRoutes from './routes/auth';
import corsTestRoutes from './routes/cors-test';
import identificationTypeRoutes from './routes/identificationType';
import issuingCompanyRoutes from './routes/issuingCompany';
import clientRoutes from './routes/client';
import productRoutes from './routes/product';
import invoiceRoutes from './routes/invoice';
import invoiceDetailRoutes from './routes/invoiceDetail';
import invoicePDFRoutes from './routes/invoicePDF';
import verifyToken from './middleware/verifyToken';
import corsErrorHandler from './middleware/corsErrorHandler';

dotenv.config();

const app = express();

// Función auxiliar para verificar si un origen es válido en desarrollo
const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return false;
  
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  if (isDevelopment) {
    // Permitir localhost y 127.0.0.1 en cualquier puerto
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return true;
    }
    
    // Permitir direcciones IP de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const localNetworkPatterns = [
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/,
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}:\d+$/,
    ];
    
    for (const pattern of localNetworkPatterns) {
      if (pattern.test(origin)) {
        return true;
      }
    }
  }
  
  // En producción, verificar lista de orígenes permitidos
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];
  return allowedOrigins.includes(origin);
};

// Configuración CORS corregida
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  // Si hay un origen y está permitido, usarlo
  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Expose-Headers', 'Authorization, Content-Type');
    
    console.log(`📡 ${req.method} ${req.path} - Origin: ${origin} ✅`);
  } 
  // Si no hay origen pero estamos en desarrollo, permitir (para Postman, curl, etc.)
  else if (!origin && isDevelopment) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Expose-Headers', 'Authorization, Content-Type');
    // NO establecer credentials cuando usamos '*'
    
    console.log(`📡 ${req.method} ${req.path} - No origin (Postman/curl) ✅`);
  }
  // Si hay origen pero no está permitido
  else if (origin) {
    console.log(`🚫 ${req.method} ${req.path} - Origin bloqueado: ${origin}`);
    // No establecer headers CORS, el navegador rechazará la petición
  }
  
  // Manejar preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request handled');
    return res.status(204).end();
  }
  
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Rutas públicas (sin autenticación)
app.use(authRoutes);
app.use(corsTestRoutes);

const swaggerHtml = `<!DOCTYPE html>
<html>
<head>
  <title>API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({ url: '/swagger.json', dom_id: '#swagger-ui' });
    };
  </script>
</body>
</html>`;

// Public routes for documentation
app.get('/swagger.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.get('/docs', (_req, res) => {
  res.type('html').send(swaggerHtml);
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Authentication middleware for protected routes
app.use(verifyToken);
app.use('/api/v1/identification-type', identificationTypeRoutes);
app.use('/api/v1/issuing-company', issuingCompanyRoutes);
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/invoice', invoiceRoutes);
app.use('/api/v1/invoice-detail', invoiceDetailRoutes);
app.use('/api/v1/invoice-pdf', invoicePDFRoutes);

// Error handling middleware (debe ir al final)
app.use(corsErrorHandler);

// Middleware de manejo general de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

const PORT = process.env.PORT || 3000;

// Validar que MONGODB_URI esté configurado
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI no está configurado en las variables de entorno');
  console.error('   Por favor, crea un archivo .env con: MONGODB_URI=mongodb://localhost:27017/f-sri');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📄 API Docs: http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error', err);
    process.exit(1);
  });
