import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../auth/PrivateRoute';
import { PublicRoute } from '../auth/PublicRoutes';
import Dashboard from '../pages/dashboard';
import AuthPage from '../pages/login/AuthPage';
import UploadFile from '../pages/uploadFile';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/import"
        element={
          <PrivateRoute>
            <UploadFile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}