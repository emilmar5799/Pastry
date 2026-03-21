# PastryFlora - Frontend Client

Esta es la aplicación Frontend (Cliente) para el sistema de gestión de Pastelería Flora, construida con **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

## 🚀 Requisitos Previos
- [Node.js](https://nodejs.org/) v16 o superior.
- Haber inicializado el Backend de PastryFlora.

## 🛠 Instalación y Ejecución

1. **Instalar dependencias:**
   Dentro del directorio `PastryFloraFront`, ejecuta:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo `.env.example` y renómbralo a `.env`. Define la URL de la API del backend:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Ejecutar en entorno de Desarrollo:**
   Vite iniciará un servidor de desarrollo rápido, generalmente en `http://localhost:5173`.
   ```bash
   npm run dev
   ```

4. **Construir para Producción:**
   ```bash
   npm run build
   npm run preview
   ```

## 📂 Estructura del Proyecto

El código base se encuentra en `src/`:

- **`App.tsx` / `main.tsx`**: Puntos de entrada de la aplicación.
- **`api/` y `services/`**: Lógica para conectarse al servidor Backend (Axios, Fetch).
- **`components/`**: Componentes visuales reutilizables (Botones, Tablas, Layout principal, Modales).
- **`pages/`**: Vistas completas de la aplicación (Home, Login, Ventas, etc.).
- **`routes/`**: Configuración de React Router y protección de rutas.
- **`context/` / `hooks/`**: Manejo del estado global de la aplicación (ej. Contexto de Autenticación para `useAuth()`).
- **`types/`**: Interfaces TypeScript de los modelos (Product, Sale, User, Role...).
- **`utils/`**: Funciones de ayuda generales.

## 🔗 Rutas y Vistas de la Aplicación

La navegación principal es manejada por `React Router` en `src/routes/AppRouter.tsx`:

### Públicas
*   **`/login`** - Pantalla de inicio de sesión.
*   **`*`** - Vista de error 404 para rutas no encontradas.

### Privadas (Requieren Autenticación)
*   **`/`** - Tablero o Home principal.
*   **`/sales`** - Listado de ventas rápidas de sucursal.
    *   `/sales/new` - Nueva venta en POS.
    *   `/sales/:id` - Detalles e impresión de ticket de la venta.
*   **`/orders`** - Listado de reservas / pedidos grandes.
    *   `/orders/new` - Formulario de nueva reserva.
    *   `/orders/:id` - Detalle de reserva.
    *   `/orders/:id/edit` - Editar datos funcionales de una reserva.
*   **`/refill`** - Pantalla para control de producción y distribución interna (roles ADMIN, SUPERVISOR, REFILL, SELLER).
    *   `/refill/:id` - Detalle de un relleno o reabastecimiento.
    *   Permite control específico en `/refill/:id/add-products` (solo ADMIN/SUPERVISOR).

### Protegidas (Solo Administración / Supervisores)
*   **`/products`** - (Admin, Supervisor) Catálogo CRUD de productos.
*   **`/reports`** - (Admin) Gráficos e indicadores de ventas y rentabilidad.
*   **`/users`** - (Admin) Panel de control de personal, usuarios y contraseñas.
