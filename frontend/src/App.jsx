import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { StudentLayout } from './components/StudentLayout';
import { EVMLayout } from './components/EVMLayout';
import { BackgroundAnimation } from './components/common/BackgroundAnimation';
import { BackgroundControls } from './components/common/BackgroundControls';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { InstitutionProvider } from './context/InstitutionContext';

// Automatic Route Theme Synchronizer: Dark Matrix on Login, Clean Light Mode on Portals
function RouteThemeSynchronizer() {
  const location = useLocation();
  const { setTheme, setBgMode } = useTheme();

  useEffect(() => {
    const isLogin = location.pathname === '/login' || location.pathname === '/';
    if (isLogin) {
      setTheme('dark');
      setBgMode('matrix');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-matrix-theme', 'true');
    } else {
      setTheme('light');
      setBgMode('cyber');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.removeAttribute('data-matrix-theme');
    }
  }, [location.pathname, setTheme, setBgMode]);

  return null;
}

function ConditionalBackgroundControls() {
  const location = useLocation();
  const isLogin = location.pathname === '/login' || location.pathname === '/';
  if (isLogin) return null;
  return <BackgroundControls />;
}

// Public Pages
import { LoginPage } from './pages/public/LoginPage';
import { PublicVerifier } from './pages/public/PublicVerifier';
import EVMKiosk from './pages/public/EVMKiosk';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentIDCard } from './pages/student/StudentIDCard';
import { StudentIDVerification } from './pages/student/StudentIDVerification';
import { StudentElections } from './pages/student/StudentElections';
import { StudentCandidates } from './pages/student/StudentCandidates';
import { StudentVotingSession } from './pages/student/StudentVotingSession';
import { StudentVoteConfirmation } from './pages/student/StudentVoteConfirmation';
import { StudentStatus } from './pages/student/StudentStatus';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentSectionPortal } from './pages/student/StudentSectionPortal';
import { StudentCertificates } from './pages/student/StudentCertificates';
import { StudentNomination } from './pages/student/StudentNomination';
import { StudentPracticeBooth } from './pages/student/StudentPracticeBooth';
import { StudentReceiptAudit } from './pages/student/StudentReceiptAudit';
import { StudentBoothRadar } from './pages/student/StudentBoothRadar';
import { StudentTownhall } from './pages/student/StudentTownhall';
import { StudentDepartmentRepHub } from './pages/student/StudentDepartmentRepHub';
import { StudentSettings } from './pages/student/StudentSettings';

// EVM Operator Pages
import { EVMDashboard } from './pages/evm/EVMDashboard';
import { EVMElections } from './pages/evm/EVMElections';
import { EVMCandidates } from './pages/evm/EVMCandidates';
import { EVMVoters } from './pages/evm/EVMVoters';
import { EVMVerification } from './pages/evm/EVMVerification';
import { EVMVotingSessions } from './pages/evm/EVMVotingSessions';
import { EVMResults } from './pages/evm/EVMResults';
import { EVMSecurityEvents } from './pages/evm/EVMSecurityEvents';
import { EVMBlockchain } from './pages/evm/EVMBlockchain';
import { EVMAuditLogs } from './pages/evm/EVMAuditLogs';
import { EVMSettings } from './pages/evm/EVMSettings';

// Admin Suite Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDepartments } from './pages/admin/AdminDepartments';
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
import { AdminDatabaseViewer } from './pages/admin/AdminDatabaseViewer';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InstitutionProvider>
          <BrowserRouter>
            {/* Automatic Route Theme Synchronizer: Dark Matrix for Login, Clean Light Mode for Portals */}
            <RouteThemeSynchronizer />
            {/* Full-Screen Animated Background */}
            <BackgroundAnimation />
            {/* Floating Ambiance & Theme Controls (Hidden on Login for pure Matrix immersion) */}
            <ConditionalBackgroundControls />
            <Routes>
              {/* Public Authentication & Verification Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify" element={<PublicVerifier />} />
              <Route path="/verify-receipt" element={<PublicVerifier />} />

              {/* Dedicated EVM Hardware/Kiosk Polling Terminal */}
              <Route path="/evm-kiosk" element={<EVMKiosk />} />
              <Route path="/kiosk" element={<EVMKiosk />} />
              <Route path="/results" element={<AdminResults />} />

              {/* Student Voter Protected Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute requiredRole={['STUDENT', 'ADMIN']}>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="id" element={<StudentIDCard />} />
                <Route path="id-verification" element={<StudentIDVerification />} />
                <Route path="elections" element={<StudentElections />} />
                <Route path="elections/:id/candidates" element={<StudentCandidates />} />
                <Route path="candidates" element={<StudentCandidates />} />
                <Route path="voting-session" element={<StudentVotingSession />} />
                <Route path="vote-confirmation" element={<StudentVoteConfirmation />} />
                <Route path="status" element={<StudentStatus />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="section" element={<StudentSectionPortal />} />
                <Route path="sections" element={<StudentSectionPortal />} />
                <Route path="representative" element={<StudentDepartmentRepHub />} />
                <Route path="booth-radar" element={<StudentBoothRadar />} />
                <Route path="townhall" element={<StudentTownhall />} />
                <Route path="nomination" element={<StudentNomination />} />
                <Route path="practice-booth" element={<StudentPracticeBooth />} />
                <Route path="receipt-audit" element={<StudentReceiptAudit />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="settings" element={<StudentSettings />} />
              </Route>

              {/* EVM Officer & Terminal Operations Routes */}
              <Route
                path="/evm"
                element={
                  <ProtectedRoute requiredRole={['EVM', 'ADMIN']}>
                    <EVMLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/evm/dashboard" replace />} />
                <Route path="dashboard" element={<EVMDashboard />} />
                <Route path="elections" element={<EVMElections />} />
                <Route path="candidates" element={<EVMCandidates />} />
                <Route path="voters" element={<EVMVoters />} />
                <Route path="verification" element={<EVMVerification />} />
                <Route path="voting-sessions" element={<EVMVotingSessions />} />
                <Route path="results" element={<EVMResults />} />
                <Route path="security-events" element={<EVMSecurityEvents />} />
                <Route path="blockchain" element={<EVMBlockchain />} />
                <Route path="audit-logs" element={<EVMAuditLogs />} />
                <Route path="settings" element={<EVMSettings />} />
              </Route>

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
                <Route path="departments" element={<AdminDepartments />} />
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
                <Route path="database" element={<AdminDatabaseViewer />} />
              </Route>

              {/* Fallback Redirects */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </InstitutionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
