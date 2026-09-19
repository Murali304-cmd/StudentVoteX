import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { BackgroundAnimation } from './components/common/BackgroundAnimation';

// Public Pages
import { LoginPage } from './pages/public/LoginPage';
import { PublicVerifier } from './pages/public/PublicVerifier';
import EVMKiosk from './pages/public/EVMKiosk';

// Admin Suite Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminEVMUsers } from './pages/admin/AdminEVMUsers';
import { AdminIDCards } from './pages/admin/AdminIDCards';
import { AdminElections } from './pages/admin/AdminElections';
import { AdminCandidates } from './pages/admin/AdminCandidates';
import { AdminVoters } from './pages/admin/AdminVoters';
import { AdminVerification } from './pages/admin/AdminVerification';
import { AdminSecurityEvents } from './pages/admin/AdminSecurityEvents';
import { AdminAccessControl } from './pages/admin/AdminAccessControl';
import { AdminBlockchain } from './pages/admin/AdminBlockchain';
import { AdminBlocks } from './pages/admin/AdminBlocks';
import { AdminTransactions } from './pages/admin/AdminTransactions';
import { AdminMerkleTree } from './pages/admin/AdminMerkleTree';
import { AdminNetwork } from './pages/admin/AdminNetwork';
import { AdminMining } from './pages/admin/AdminMining';
import { AdminValidation } from './pages/admin/AdminValidation';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Full-Screen Cyber Blockchain Animated Background (Position Fixed, Pointer-Events None, z-index: 0) */}
        <BackgroundAnimation />
        <Routes>
          {/* Public Authentication & Verification Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<PublicVerifier />} />
          <Route path="/verify-receipt" element={<PublicVerifier />} />

          {/* Dedicated EVM Voting Machine Routes (Registered Students Vote Here) */}
          <Route path="/evm" element={<EVMKiosk />} />
          <Route path="/evm-kiosk" element={<EVMKiosk />} />
          <Route path="/evm/results" element={<AdminResults />} />
          <Route path="/results" element={<AdminResults />} />

          {/* Admin Protected Governance Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="evm-users" element={<AdminEVMUsers />} />
            <Route path="id-cards" element={<AdminIDCards />} />
            <Route path="elections" element={<AdminElections />} />
            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="voters" element={<AdminVoters />} />
            <Route path="verification" element={<AdminVerification />} />
            <Route path="access-control" element={<AdminAccessControl />} />
            <Route path="security-events" element={<AdminSecurityEvents />} />
            <Route path="blockchain" element={<AdminBlockchain />} />
            <Route path="blocks" element={<AdminBlocks />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="merkle-tree" element={<AdminMerkleTree />} />
            <Route path="network" element={<AdminNetwork />} />
            <Route path="mining" element={<AdminMining />} />
            <Route path="validation" element={<AdminValidation />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback Redirects */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
