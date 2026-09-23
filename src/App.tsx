import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuditProvider } from './contexts/AuditContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import CasesList from './pages/CasesList';
import CaseDetail from './pages/CaseDetail';
import AuditTrail from './pages/AuditTrail';


const ProtectedRoute = ({ children, requireRole }: { children: React.ReactNode, requireRole?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && !requireRole.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/cases" replace />} />
        <Route path="cases" element={<CasesList />} />
        <Route path="cases/:id" element={<CaseDetail />} />
        <Route path="dashboard" element={<Navigate to="/cases" replace />} />
        <Route path="audit" element={<AuditTrail />} />
      </Route>


    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuditProvider>
    </AuthProvider>
  );
}

export default App;
