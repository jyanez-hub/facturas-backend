# 🚀 Inicio Rápido con Postman

## Pasos para comenzar a probar los endpoints

### 1. Importar la Colección

1. Abre Postman
2. Click en **Import**
3. Selecciona el archivo `POSTMAN_COLLECTION.json`
4. La colección aparecerá en tu sidebar

### 2. Configurar el Environment

1. En Postman, click en **Environments** en el panel izquierdo (o el ícono de engranaje ⚙️)
2. Click en el botón **+** o **Create Environment**
3. Nombra el environment: `Backend Facturas - Local`
4. Agrega estas variables (solo necesitas llenar la columna **Value**):

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:3000` |
| `token` | (dejar vacío - se llenará automáticamente) |
| `company_id` | (dejar vacío - se llenará automáticamente) |
| `id_type_id` | (dejar vacío - se llenará automáticamente) |
| `client_id` | (dejar vacío - se llenará automáticamente) |
| `product_id` | (dejar vacío - se llenará automáticamente) |
| `invoice_id` | (dejar vacío - se llenará automáticamente) |
| `clave_acceso` | (dejar vacío - se llenará automáticamente) |

**📝 Nota:** Solo necesitas agregar el nombre de la variable y dejar el valor vacío (excepto `base_url`). Los scripts automáticos de las requests llenarán estos valores por ti.

5. Click en **Save** (botón naranja arriba a la derecha)
6. Selecciona el environment `Backend Facturas - Local` en el dropdown de la esquina superior derecha

### 3. Iniciar el Servidor

```bash
cd facturas-backend
npm run dev
```

Deberías ver:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
🌐 Environment: development
📄 API Docs: http://localhost:3000/docs
```

### 4. Flujo de Prueba Recomendado

#### Paso 1: Verificar que el servidor está funcionando
```
GET /health
```

#### Paso 2: Registrar el primer usuario
```
POST /register
```
**Importante:** Actualiza el campo `masterKey` en el body con tu clave maestra del archivo `.env`

El script de Postman guardará automáticamente el `token` en tus variables de environment.

#### Paso 3: Crear datos maestros
1. **Crear Tipo de Identificación**
   ```
   POST /api/v1/identification-type
   ```

2. **Crear Cliente**
   ```
   POST /api/v1/client
   ```

3. **Crear Producto**
   ```
   POST /api/v1/product
   ```

#### Paso 4: Crear una Factura Completa
```
POST /api/v1/invoice/complete
```

Este endpoint:
- ✅ Crea la factura
- ✅ Crea los detalles
- ✅ Genera la clave de acceso
- ✅ Crea el XML firmado
- ✅ Genera el PDF
- ✅ Envía al SRI (asíncrono)

#### Paso 5: Ver el PDF generado
```
GET /api/v1/invoice-pdf
```

### 5. Tips Útiles

#### ✨ Scripts Automáticos
Las siguientes requests guardan automáticamente los IDs en las variables:

- **Login/Registro** → Guarda `token` y `company_id`
- **Crear Tipo ID** → Guarda `id_type_id`
- **Crear Cliente** → Guarda `client_id`
- **Crear Producto** → Guarda `product_id`
- **Crear Factura** → Guarda `invoice_id` y `clave_acceso`

#### 🔄 Renovar Token
Si recibes error `401 Unauthorized`:
1. Ve a la carpeta **1. Autenticación**
2. Ejecuta **Login**
3. El token se actualizará automáticamente

#### 📋 Ver todas las variables
En Postman, click en el ojo (👁️) en la esquina superior derecha para ver todas tus variables de environment.

#### 🔍 Debug
Si algo no funciona:
1. Verifica los logs del servidor en la consola
2. Revisa que el token esté configurado correctamente
3. Asegúrate de que MongoDB esté corriendo
4. Verifica que todas las variables de environment estén configuradas

### 6. Orden Sugerido de Pruebas

```
1. Health Check → Verificar servidor
2. Registro → Crear usuario y empresa
3. Login → Obtener token (si ya te registraste antes)
4. Crear Tipo de Identificación → Datos maestros
5. Crear Cliente → Datos maestros
6. Crear Producto → Datos maestros
7. Crear Factura Completa → Proceso principal
8. Listar PDFs → Ver resultados
9. Descargar PDF → Obtener el archivo
```

### 7. Endpoints Más Usados

| Endpoint | Método | Para qué sirve |
|----------|--------|----------------|
| `/register` | POST | Registro inicial del sistema |
| `/auth` | POST | Iniciar sesión |
| `/api/v1/invoice/complete` | POST | Crear factura completa |
| `/api/v1/invoice` | GET | Listar todas las facturas |
| `/api/v1/invoice-pdf/download/:clave` | GET | Descargar PDF |
| `/api/v1/client` | GET/POST | Gestionar clientes |
| `/api/v1/product` | GET/POST | Gestionar productos |

### 8. Errores Comunes

#### Error: "MASTER_REGISTRATION_KEY required"
**Solución:** Agrega `MASTER_REGISTRATION_KEY` en tu archivo `.env`

#### Error: 401 Unauthorized
**Solución:** Ejecuta el endpoint de Login nuevamente

#### Error: "Product not found"
**Solución:** Asegúrate de crear el producto primero con el mismo `codigoPrincipal`

#### Error: "Client not found"
**Solución:** Asegúrate de crear el cliente con la misma `identificacion`

#### Error: Cannot connect to MongoDB
**Solución:** 
1. Verifica que MongoDB esté corriendo
2. Revisa la variable `MONGODB_URI` en tu `.env`

### 9. Documentación Swagger

También puedes explorar la API de forma interactiva en:

🌐 **http://localhost:3000/docs**

Esta interfaz te permite:
- Ver todos los endpoints disponibles
- Ver los schemas de request/response
- Probar endpoints directamente desde el navegador
- Ver ejemplos de uso

---

## 📚 Recursos Adicionales

- **Guía Completa:** Ver `POSTMAN_GUIDE.md` para documentación detallada
- **Collection JSON:** `POSTMAN_COLLECTION.json` para importar en Postman
- **Tests:** `__tests__/routes.test.ts` para ver ejemplos de uso programático

---

## 🆘 Ayuda

Si tienes problemas:

1. Revisa los logs del servidor
2. Verifica que todas las variables de environment estén configuradas
3. Asegúrate de que MongoDB esté corriendo
4. Consulta la guía completa en `POSTMAN_GUIDE.md`

¡Listo para comenzar! 🎉

