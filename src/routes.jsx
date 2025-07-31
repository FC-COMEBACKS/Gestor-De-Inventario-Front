import React from 'react';
import { NotFoundPage } from './pages';
import AuthTabs from './components/auth/AuthTabs';
import DashboardAdminPage from './pages/dashboard/DashboardAdminPage';
import DashboardUserPage from './pages/dashboard/DashboardUserPage';
import { CategoriaPage, CategoriasClientePage } from './pages/categoria';
import { UserPage, PerfilPage } from './pages/user';
import { ProductosPage, ProductoDetailPage, CatalogoPage } from './pages/productos';
import { CarritoPage } from './pages/carritoDeCompras';
import { FacturaPage, FacturaDetailPage } from './pages/factura';
import { ProtectedRoute } from './components/auth';

export const routes = [
  {
    path: '/auth',
    element: <AuthTabs />
  },
  {
    path: '/',
    element: <ProtectedRoute element={<DashboardUserPage />} />
  },
  {
    path: '/dashboard-admin',
    element: <ProtectedRoute element={<DashboardAdminPage />} adminOnly={true} />
  },
  {
    path: '/dashboard-user', 
    element: <ProtectedRoute element={<DashboardUserPage />} />
  },
  {
    path: '/categorias',
    element: <ProtectedRoute element={<CategoriaPage />} adminOnly={true} />
  },
  {
    path: '/categorias-cliente',
    element: <ProtectedRoute element={<CategoriasClientePage />} />
  },
  {
    path: '/productos',
    element: <ProtectedRoute element={<ProductosPage />} adminOnly={true} />
  },
  {
    path: '/catalogo',
    element: <ProtectedRoute element={<CatalogoPage />} />
  },
  {
    path: '/carrito',
    element: <ProtectedRoute element={<CarritoPage />} />
  },
  {
    path: '/facturas',
    element: <ProtectedRoute element={<FacturaPage />} />
  },
  {
    path: '/facturas/:id',
    element: <ProtectedRoute element={<FacturaDetailPage />} />
  },
  {
    path: '/productos/:id',
    element: <ProtectedRoute element={<ProductoDetailPage />} />
  },
  {
    path: '/usuarios',
    element: <ProtectedRoute element={<UserPage />} adminOnly={true} />
  },
  {
    path: '/perfil',
    element: <ProtectedRoute element={<PerfilPage />} />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];