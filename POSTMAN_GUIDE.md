# 📮 Guía de Pruebas con Postman

Esta guía te ayudará a probar todos los endpoints del backend usando Postman u otra herramienta similar.

## 🚀 Paso 1: Iniciar el Servidor

Primero, asegúrate de tener el servidor corriendo:

```bash
cd facturas-backend
npm run dev
```

El servidor debería estar disponible en: `http://localhost:3000`

## 🔑 Paso 2: Configurar Variables de Entorno en Postman

Crea un Environment en Postman con estas variables:

- `base_url`: `http://localhost:3000`
- `token`: (se llenará automáticamente después del login)
- `company_id`: (se llenará después del registro)

## 📝 Flujo de Pruebas

### 1️⃣ Verificar Estado del Servidor

**GET** `{{base_url}}/health`

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-05T...",
  "cors": "enabled",
  "environment": "development"
}
```

---

### 2️⃣ AUTENTICACIÓN

#### 2.1 Verificar Estado de Registro

**GET** `{{base_url}}/status`

**Respuesta esperada:**
```json
{
  "firstRegistration": true,
  "registrationDisabled": false,
  "requiresInvitation": false,
  "masterKeyRequired": true
}
```

#### 2.2 Registro de Usuario (Primera vez)

**POST** `{{base_url}}/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@miempresa.com",
  "password": "MiPassword123!",
  "ruc": "1799999999001",
  "razon_social": "Mi Empresa S.A.",
  "nombre_comercial": "Mi Empresa",
  "direccion": "Av. Principal 123",
  "telefono": "0999999999",
  "codigo_establecimiento": "001",
  "punto_emision": "001",
  "tipo_ambiente": 1,
  "tipo_emision": 1,
  "masterKey": "TU_MASTER_KEY_AQUI"
}
```

**⚠️ Importante:** 
- El `masterKey` debe coincidir con `MASTER_REGISTRATION_KEY` en tu archivo `.env`
- El RUC debe tener 13 dígitos y terminar en 001

**Respuesta esperada (201):**
```json
{
  "message": "Usuario y empresa creados exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673a...",
    "email": "admin@miempresa.com"
  },
  "company": {
    "id": "673b...",
    "ruc": "1799999999001",
    "razon_social": "Mi Empresa S.A.",
    "nombre_comercial": "Mi Empresa"
  }
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("company_id", jsonData.company.id);
}
```

#### 2.3 Login

**POST** `{{base_url}}/auth`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@miempresa.com",
  "password": "MiPassword123!"
}
```

**Respuesta esperada (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673a...",
    "email": "admin@miempresa.com"
  },
  "company": {
    "id": "673b...",
    "ruc": "1799999999001",
    "razon_social": "Mi Empresa S.A.",
    "nombre_comercial": "Mi Empresa"
  }
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

---

### 3️⃣ TIPOS DE IDENTIFICACIÓN

#### 3.1 Crear Tipo de Identificación

**POST** `{{base_url}}/api/v1/identification-type`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "codigo": "05",
  "nombre": "CEDULA",
  "descripcion": "Cédula de identidad"
}
```

#### 3.2 Listar Tipos de Identificación

**GET** `{{base_url}}/api/v1/identification-type`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 3.3 Obtener por ID

**GET** `{{base_url}}/api/v1/identification-type/{{id_type_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 3.4 Actualizar

**PUT** `{{base_url}}/api/v1/identification-type/{{id_type_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "descripcion": "Cédula de identidad actualizada"
}
```

#### 3.5 Eliminar

**DELETE** `{{base_url}}/api/v1/identification-type/{{id_type_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### 4️⃣ CLIENTES

#### 4.1 Crear Cliente

**POST** `{{base_url}}/api/v1/client`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "tipo_identificacion_id": "{{id_type_id}}",
  "identificacion": "0923456789",
  "razon_social": "Juan Pérez",
  "email": "juan.perez@email.com",
  "telefono": "0987654321",
  "direccion": "Calle Secundaria 456"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("client_id", jsonData._id);
}
```

#### 4.2 Listar Clientes

**GET** `{{base_url}}/api/v1/client`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 4.3 Obtener Cliente por ID

**GET** `{{base_url}}/api/v1/client/{{client_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 4.4 Actualizar Cliente

**PUT** `{{base_url}}/api/v1/client/{{client_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "email": "juan.perez.nuevo@email.com",
  "telefono": "0999888777"
}
```

#### 4.5 Eliminar Cliente

**DELETE** `{{base_url}}/api/v1/client/{{client_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### 5️⃣ PRODUCTOS

#### 5.1 Crear Producto

**POST** `{{base_url}}/api/v1/product`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "codigo": "PROD001",
  "nombre": "Laptop Dell XPS 15",
  "descripcion": "Laptop de alto rendimiento",
  "precio_venta": 1500.00,
  "precio_unitario": 1500.00,
  "tiene_iva": true,
  "porcentaje_iva": 12
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("product_id", jsonData._id);
}
```

#### 5.2 Listar Productos

**GET** `{{base_url}}/api/v1/product`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 5.3 Obtener Producto por ID

**GET** `{{base_url}}/api/v1/product/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 5.4 Actualizar Producto

**PUT** `{{base_url}}/api/v1/product/{{product_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "precio_venta": 1450.00
}
```

#### 5.5 Eliminar Producto

**DELETE** `{{base_url}}/api/v1/product/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### 6️⃣ EMPRESA EMISORA

#### 6.1 Listar Empresas

**GET** `{{base_url}}/api/v1/issuing-company`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 6.2 Obtener Empresa por ID

**GET** `{{base_url}}/api/v1/issuing-company/{{company_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 6.3 Actualizar Empresa

**PUT** `{{base_url}}/api/v1/issuing-company/{{company_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "telefono": "0987654321",
  "direccion": "Nueva dirección actualizada"
}
```

---

### 7️⃣ FACTURAS (CRUD Básico)

#### 7.1 Crear Factura Básica

**POST** `{{base_url}}/api/v1/invoice`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "cliente_id": "{{client_id}}",
  "empresa_emisora_id": "{{company_id}}",
  "fecha_emision": "05/11/2025",
  "subtotal_sin_impuestos": 100.00,
  "subtotal_iva": 100.00,
  "subtotal_0": 0,
  "valor_iva": 12.00,
  "total": 112.00
}
```

#### 7.2 Listar Facturas

**GET** `{{base_url}}/api/v1/invoice`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### 8️⃣ FACTURA COMPLETA (Recomendado)

Este endpoint crea la factura, detalles, XML firmado y procesa el envío al SRI automáticamente.

**POST** `{{base_url}}/api/v1/invoice/complete`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "factura": {
    "infoTributaria": {
      "ruc": "1799999999001",
      "secuencial": "123"
    },
    "infoFactura": {
      "fechaEmision": "05/11/2025",
      "tipoIdentificacionComprador": "05",
      "identificacionComprador": "0923456789",
      "totalSinImpuestos": "100.00",
      "importeTotal": "112.00"
    },
    "detalles": [
      {
        "detalle": {
          "codigoPrincipal": "PROD001",
          "descripcion": "Laptop Dell XPS 15",
          "cantidad": "1",
          "precioUnitario": "100.00",
          "precioTotalSinImpuesto": "100.00",
          "impuestos": [
            {
              "impuesto": {
                "codigo": "2",
                "codigoPorcentaje": "2",
                "tarifa": "12",
                "baseImponible": "100.00",
                "valor": "12.00"
              }
            }
          ]
        }
      }
    ]
  }
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "data": {
    "factura": {
      "sri_estado": "PENDIENTE",
      "data": {
        "clave_acceso": "0511202501179999999900110010010000001231234567812",
        "secuencial": "000000001",
        ...
      }
    },
    "detalles": [...],
    "xml": "<xml>...</xml>"
  },
  "xml": "<xml>...</xml>"
}
```

---

### 9️⃣ DETALLES DE FACTURA

#### 9.1 Crear Detalle de Factura

**POST** `{{base_url}}/api/v1/invoice-detail`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "factura_id": "{{invoice_id}}",
  "producto_id": "{{product_id}}",
  "cantidad": 2,
  "precio_unitario": 100.00,
  "subtotal": 200.00,
  "porcentaje_iva": 12,
  "valor_iva": 24.00,
  "total": 224.00
}
```

#### 9.2 Listar Detalles

**GET** `{{base_url}}/api/v1/invoice-detail`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

### 🔟 PDFs DE FACTURAS

#### 10.1 Listar todos los PDFs

**GET** `{{base_url}}/api/v1/invoice-pdf`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 10.2 Obtener PDF por ID de Factura

**GET** `{{base_url}}/api/v1/invoice-pdf/invoice/{{invoice_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 10.3 Obtener PDF por Clave de Acceso

**GET** `{{base_url}}/api/v1/invoice-pdf/access-key/{{clave_acceso}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 10.4 Descargar PDF

**GET** `{{base_url}}/api/v1/invoice-pdf/download/{{clave_acceso}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Respuesta:** Archivo PDF descargable

#### 10.5 Regenerar PDF

**POST** `{{base_url}}/api/v1/invoice-pdf/regenerate/{{invoice_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 10.6 Enviar PDF por Email

**POST** `{{base_url}}/api/v1/invoice-pdf/send-email/{{clave_acceso}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "email_destinatario": "cliente@example.com"
}
```

#### 10.7 Verificar Estado de Email

**GET** `{{base_url}}/api/v1/invoice-pdf/email-status/{{clave_acceso}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

#### 10.8 Reintentar Envío de Email

**POST** `{{base_url}}/api/v1/invoice-pdf/retry-email/{{clave_acceso}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

---

## 📚 Importar Colección a Postman

Para facilitar las pruebas, puedes importar el archivo JSON de colección de Postman que se encuentra en este directorio: `POSTMAN_COLLECTION.json`

---

## ⚠️ Errores Comunes

### 401 Unauthorized
- El token expiró o no es válido
- Realiza login nuevamente y actualiza el token

### 404 Not Found
- El ID del recurso no existe
- Verifica que el ID sea correcto

### 400 Bad Request
- Datos faltantes o formato incorrecto
- Revisa que todos los campos requeridos estén presentes

### 500 Internal Server Error
- Error del servidor
- Revisa los logs del servidor en la consola

---

## 🔍 Tips Útiles

1. **Usa variables de entorno** en Postman para almacenar IDs y tokens
2. **Guarda las respuestas** para usar los IDs en solicitudes posteriores
3. **Organiza las peticiones** en carpetas por funcionalidad
4. **Usa Pre-request Scripts** para automatizar la configuración
5. **Revisa los logs** del servidor para ver detalles de los errores

---

## 📖 Documentación Swagger

También puedes explorar la documentación interactiva en:

`http://localhost:3000/docs`

Esta interfaz te permite probar los endpoints directamente desde el navegador.

