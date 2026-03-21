# PastryFlora - Backend API

Esta es la API (Backend) para el sistema de gestión de Pastelería Flora, construida con **Node.js, Express, TypeScript y MySQL**.

## 🚀 Requisitos Previos
- [Node.js](https://nodejs.org/) v16 o superior.
- [MySQL](https://www.mysql.com/) para la base de datos relacional.

## 🛠 Instalación y Ejecución

1. **Instalar dependencias:**
   Ejecuta el siguiente comando en la raíz del proyecto backend (`PastryFloraBack`):
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo `.env.example` y renómbralo a `.env`. Ajusta las credenciales de tu base de datos:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=Pastry
   JWT_SECRET=tu_secreto_jwt
   ```

3. **Ejecutar en entorno de Desarrollo:**
   Se utiliza `ts-node-dev` para recargar automáticamente al hacer cambios.
   ```bash
   npm run dev
   ```

4. **Construir para Producción:**
   ```bash
   npm run build
   npm run start
   ```

## 📂 Estructura del Proyecto

El código fuente se encuentra en la carpeta `src/`. Así se organiza:

- **`config/`**: Configuración global (ej. conexión a la base de datos).
- **`models/`**: (Opcional) Definición de esquemas o interfaces TypeScript.
- **`repositories/`**: Capa de abstracción de base de datos. Consultas SQL (`SELECT`, `INSERT`, etc.).
- **`services/`**: Lógica de negocio. Los servicios llaman a los repositorios.
- **`controllers/`**: Manejan las peticiones HTTP (`req`, `res`), validan datos de entrada y llaman a los servicios.
- **`middlewares/`**: Funciones intermedias como verificación de tokens JWT (`auth`), manejo de errores, etc.
- **`routes/`**: Definición de los endpoints. Conectan una URL (`/api/...`) a una función del controlador.
- **`utils/`**: Funciones auxiliares o helpers (ej. formateo de fechas, encriptación bcrypt).
- **`app.ts`**: Configura Express, middlewares globales y montado de rutas.
- **`server.ts`**: Punto de entrada principal que levanta el servidor en el puerto establecido.

## 🔗 Rutas Actuales de la API

Las rutas base configuradas en `app.ts` son:

*   **`GET /health`** - Chequeo rápido de estado del servidor (`status: 'ok'`).
*   **`/api/auth`** - Sistema de autenticación (Login, registro, validación de tokens).
*   **`/api/products`** - Catálogo de productos (CRUD).
*   **`/api/orders`** - Gestión de pedidos y reservas personalizadas. También maneja detalles de los ítems en órdenes.
*   **`/api/sales`** - Gestión de ventas normales en sucursal y registro de detalle de ventas.
*   **`/api/reports`** - (*Solo Admin*) Generación de reportes estadísticos y financieros.
*   **`/api/users`** - (*Solo Admin*) Administración de usuarios, roles y personal.

**Nota Técnica:** Puedes revisar dentro de la carpeta `src/routes/` los submétodos exactos (`GET`, `POST`, `PUT`, `DELETE`) de cada una.
