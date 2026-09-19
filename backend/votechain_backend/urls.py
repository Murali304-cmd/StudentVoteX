from django.urls import path
from .views import (
    ApiRootView,
    LoginView, CurrentUserView,
    AdminStudentListView, AdminStudentDetailView,
    StudentIDVerificationUploadView, StudentIDOCRScanView,
    AdminVerificationListView, AdminVerificationReviewView, AdminAutoVerifyQRView,
    CampusGatewayCheckView, CampusNetworkPolicyView, DeviceRegistryListView,
    DeviceRegistryActionView, CampusNetworkTelemetryView,
    ElectionListView, ElectionDetailView, CandidateListView,
    VotingSessionInitView, CastVoteView,
    SecurityEventLogView, AdminSecurityEventListView,
    BlockchainStatsView, BlockchainBlocksView, BlockchainBlockDetailView,
    BlockchainTransactionsView, BlockchainMerkleTreeView, BlockchainNetworkView,
    BlockchainMineView, BlockchainValidationView, BlockchainTamperDemoView,
    BlockchainReceiptVerifyView,
    AdminAuditLogListView, ElectionResultsView, SystemSettingsView,
    AIThreatAssessmentView, RankedChoiceSimulationView,
    EVMVoterVerificationView,
    AdminEVMStationListView, AdminEVMStationDetailView,
    ElectionCertificatesView, StudentMyCertificatesView, PublicCertificateVerifyView,
    # Enterprise Auth Endpoints
    MFAEnrollView, MFAVerifyView, FIDO2VerifySimulatorView
)

urlpatterns = [
    # Root API Index
    path('', ApiRootView.as_view(), name='api-root'),

    # Auth & MFA
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/me/', CurrentUserView.as_view(), name='api-me'),
    path('auth/mfa/enroll/', MFAEnrollView.as_view(), name='api-mfa-enroll'),
    path('auth/mfa/verify/', MFAVerifyView.as_view(), name='api-mfa-verify'),
    path('auth/mfa/fido2/', FIDO2VerifySimulatorView.as_view(), name='api-mfa-fido2'),

    path('settings/', SystemSettingsView.as_view(), name='api-settings'),
    path('admin/settings/', SystemSettingsView.as_view(), name='api-admin-settings'),

    # Campus Access Gateway & Device Trust
    path('gateway/check-access/', CampusGatewayCheckView.as_view(), name='gateway-check'),
    path('admin/gateway/policy/', CampusNetworkPolicyView.as_view(), name='admin-gateway-policy'),
    path('admin/gateway/devices/', DeviceRegistryListView.as_view(), name='admin-gateway-devices'),
    path('admin/gateway/devices/<int:pk>/action/', DeviceRegistryActionView.as_view(), name='admin-gateway-device-action'),
    path('admin/gateway/telemetry/', CampusNetworkTelemetryView.as_view(), name='admin-gateway-telemetry'),

    # Admin Student Management
    path('admin/students/', AdminStudentListView.as_view(), name='admin-students'),
    path('admin/students/<int:pk>/', AdminStudentDetailView.as_view(), name='admin-student-detail'),

    # ID Verification
    path('student/id-verification/upload/', StudentIDVerificationUploadView.as_view(), name='student-id-upload'),
    path('student/id-verification/ocr-scan/', StudentIDOCRScanView.as_view(), name='student-ocr-scan'),
    path('admin/verifications/', AdminVerificationListView.as_view(), name='admin-verifications'),
    path('admin/verifications/auto-verify-qr/', AdminAutoVerifyQRView.as_view(), name='admin-verifications-auto-qr'),
    path('admin/verifications/<int:pk>/review/', AdminVerificationReviewView.as_view(), name='admin-verification-review'),

    # Elections & Candidates
    path('elections/', ElectionListView.as_view(), name='elections-list'),
    path('elections/<int:pk>/', ElectionDetailView.as_view(), name='election-detail'),
    path('candidates/', CandidateListView.as_view(), name='candidates-list'),

    # Voting Engine
    path('voting/session-init/', VotingSessionInitView.as_view(), name='voting-session-init'),
    path('voting/cast/', CastVoteView.as_view(), name='voting-cast'),

    # Security Telemetry & AI Threats
    path('security/log-event/', SecurityEventLogView.as_view(), name='security-log-event'),
    path('admin/security-events/', AdminSecurityEventListView.as_view(), name='admin-security-events'),
    path('security/ai-threat-assessment/', AIThreatAssessmentView.as_view(), name='security-ai-threat-assessment'),

    # Blockchain Explorer & BFT Consensus
    path('blockchain/stats/', BlockchainStatsView.as_view(), name='blockchain-stats'),
    path('blockchain/blocks/', BlockchainBlocksView.as_view(), name='blockchain-blocks'),
    path('blockchain/blocks/<int:index>/', BlockchainBlockDetailView.as_view(), name='blockchain-block-detail'),
    path('blockchain/transactions/', BlockchainTransactionsView.as_view(), name='blockchain-transactions'),
    path('blockchain/merkle-tree/<int:block_index>/', BlockchainMerkleTreeView.as_view(), name='blockchain-merkle-tree'),
    path('blockchain/network/', BlockchainNetworkView.as_view(), name='blockchain-network'),
    path('blockchain/mine/', BlockchainMineView.as_view(), name='blockchain-mine'),
    path('blockchain/validate/', BlockchainValidationView.as_view(), name='blockchain-validate'),
    path('blockchain/tamper-demo/', BlockchainTamperDemoView.as_view(), name='blockchain-tamper-demo'),
    path('blockchain/verify-receipt/', BlockchainReceiptVerifyView.as_view(), name='blockchain-verify-receipt'),

    # Audit Logs, Results & Certified Certificates
    path('admin/audit-logs/', AdminAuditLogListView.as_view(), name='admin-audit-logs'),
    path('admin/results/<int:pk>/', ElectionResultsView.as_view(), name='admin-results'),
    path('admin/results/<int:pk>/ranked-choice/', RankedChoiceSimulationView.as_view(), name='admin-results-irv'),
    path('elections/<int:pk>/results/', ElectionResultsView.as_view(), name='election-results'),
    path('elections/<int:pk>/certificates/', ElectionCertificatesView.as_view(), name='election-certificates'),
    path('elections/<int:pk>/certificates/generate/', ElectionCertificatesView.as_view(), name='election-certificates-generate'),
    path('student/my-certificates/', StudentMyCertificatesView.as_view(), name='student-my-certificates'),
    path('certificates/verify/<str:cert_id>/', PublicCertificateVerifyView.as_view(), name='public-certificate-verify-id'),
    path('certificates/verify/', PublicCertificateVerifyView.as_view(), name='public-certificate-verify'),

    # Physical EVM Kiosk Verification & Voting
    path('evm/verify-voter/', EVMVoterVerificationView.as_view(), name='evm-verify-voter'),
    path('admin/evm-stations/', AdminEVMStationListView.as_view(), name='admin-evm-stations'),
    path('admin/evm-stations/<int:pk>/', AdminEVMStationDetailView.as_view(), name='admin-evm-station-detail'),
]
