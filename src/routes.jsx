import React from 'react';
import { NotFoundPage } from './pages';
import AuthTabs from './components/auth/AuthTabs';
import DashboardAdminPage from './pages/dashboard/DashboardAdminPage';
import DashboardUserPage from './pages/dashboard/DashboardUserPage';
import { UserPage, PerfilPage } from './pages/user';

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
    path: '/carrito',
    element: <ProtectedRoute element={<CarritoPage />} />
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