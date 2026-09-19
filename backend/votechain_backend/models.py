import uuid
import hashlib
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student Voter'),
        ('EVM', 'EVM Officer'),
        ('ADMIN', 'System Administrator'),
        ('CEO', 'Chief Election Officer'), # Backwards compatibility alias
    )
    ELIGIBILITY_CHOICES = (
        ('ELIGIBLE', 'Eligible'),
        ('INELIGIBLE', 'Ineligible'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('DISABLED', 'Disabled'),
    )
    VERIFICATION_CHOICES = (
        ('NOT_SUBMITTED', 'Not Submitted'),
        ('PENDING', 'Pending'),
        ('UNDER_REVIEW', 'Under Review'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    student_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    roll_number = models.CharField(max_length=50, null=True, blank=True)
    full_name = models.CharField(max_length=150)
    department = models.CharField(max_length=100, default='Information Technology')
    year = models.CharField(max_length=10, default='III')
    section = models.CharField(max_length=10, default='A')
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_photo = models.TextField(blank=True, null=True)  # URL or base64 avatar
    id_card_number = models.CharField(max_length=50, blank=True, null=True)
    id_card_hash = models.CharField(max_length=64, blank=True, null=True)
    id_card_qr_ref = models.CharField(max_length=100, blank=True, null=True)
    eligibility = models.CharField(max_length=20, choices=ELIGIBILITY_CHOICES, default='ELIGIBLE')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='NOT_SUBMITTED')
    temporary_password = models.CharField(max_length=100, blank=True, null=True)

    # Multi-Factor Authentication (MFA) & Enterprise RBAC Fields
    mfa_enabled = models.BooleanField(default=False)
    totp_secret = models.CharField(max_length=64, blank=True, null=True)
    hardware_key_registered = models.BooleanField(default=False)
    hardware_key_credential_id = models.CharField(max_length=128, blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    ip_whitelist = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.student_id or self.user.username}) - {self.role}"


class IDVerificationRecord(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('UNDER_REVIEW', 'Under Review'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    )

    student = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='id_verifications')
    id_card_image = models.TextField(blank=True, null=True)
    document_hash = models.CharField(max_length=64, blank=True)
    extracted_id_number = models.CharField(max_length=50, blank=True, null=True)
    match_score = models.FloatField(default=100.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_notes = models.TextField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_verifications')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.document_hash and self.id_card_image:
            self.document_hash = hashlib.sha256(self.id_card_image.encode('utf-8')).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"ID Verification for {self.student.full_name} - {self.status}"


class Election(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('UPCOMING', 'Upcoming'),
        ('OPEN', 'Open'),
        ('ACTIVE', 'Active'),
        ('CLOSED', 'Closed'),
        ('COUNTING', 'Counting'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    academic_year = models.CharField(max_length=20, default='2026')
    department = models.CharField(max_length=100, default='ALL')
    eligible_departments = models.CharField(max_length=200, default='ALL')
    eligible_years = models.CharField(max_length=100, default='ALL')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    daily_start_time = models.CharField(max_length=10, default='09:00')
    daily_end_time = models.CharField(max_length=10, default='12:00')
    voting_hours_enforced = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    camera_required = models.BooleanField(default=True)
    id_verification_required = models.BooleanField(default=True)
    rules = models.TextField(default="1. Controlled session required.\n2. Biometric and camera monitoring active.\n3. Ephemeral key ballot encryption.\n4. Single vote per verified voter.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_within_voting_window(self):
        """
        Validates if current time is on the scheduled election date
        and within the designated daily hours (09:00 AM to 12:00 PM).
        """
        if not self.voting_hours_enforced:
            return True, "Voting hours enforcement is disabled."
            
        now = timezone.localtime(timezone.now()) if timezone.is_aware(timezone.now()) else timezone.now()
        start_dt = timezone.localtime(self.start_date) if timezone.is_aware(self.start_date) else self.start_date
        end_dt = timezone.localtime(self.end_date) if timezone.is_aware(self.end_date) else self.end_date

        if now.date() < start_dt.date():
            return False, f"Election date has not arrived yet (Scheduled for {start_dt.strftime('%B %d, %Y')})."

        if now.date() > end_dt.date():
            return False, f"Election date has concluded (Ended on {end_dt.strftime('%B %d, %Y')})."

        try:
            start_parts = [int(p) for p in self.daily_start_time.split(':')]
            end_parts = [int(p) for p in self.daily_end_time.split(':')]
            window_start = now.replace(hour=start_parts[0], minute=start_parts[1], second=0, microsecond=0)
            window_end = now.replace(hour=end_parts[0], minute=end_parts[1], second=0, microsecond=0)

            if now < window_start or now > window_end:
                return False, f"Student access is strictly restricted to 9:00 AM - 12:00 PM on election day (Current time: {now.strftime('%I:%M %p')}). Admin access is unrestricted."
        except Exception:
            pass

        return True, "Authorized within official voting window."

    def __str__(self):
        return f"{self.title} ({self.department}) [{self.status}]"


class Candidate(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    candidate_id = models.CharField(max_length=50)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='candidates')
    name = models.CharField(max_length=150)
    position = models.CharField(max_length=100, default='President')
    department = models.CharField(max_length=100)
    year = models.CharField(max_length=10, default='III')
    section = models.CharField(max_length=10, default='A')
    profile_photo = models.TextField(blank=True, null=True)
    election_symbol = models.CharField(max_length=50, default='★')
    symbol_name = models.CharField(max_length=100, default='Star')
    biography = models.TextField(blank=True)
    manifesto = models.TextField(blank=True)
    priorities = models.TextField(blank=True, default='• Student Activities\n• Technical Events\n• Sports & Culture\n• Campus Facilities\n• Academic Mentorship')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPROVED')
    vote_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.position}) - {self.election.title} [{self.status}]"


class Notification(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=50, default='INFO')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.full_name}: {self.title}"


class VoterEligibilityRecord(models.Model):
    student = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='election_records')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='voter_records')
    has_voted = models.BooleanField(default=False)
    voted_at = models.DateTimeField(null=True, blank=True)
    voting_session_token = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('student', 'election')

    def __str__(self):
        return f"{self.student.student_id} - {self.election.title} (Voted: {self.has_voted})"


class AnonymousVotingToken(models.Model):
    token_hash = models.CharField(max_length=64, unique=True)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='anonymous_tokens')
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Token {self.token_hash[:12]}... (Used: {self.is_used})"


# ---------------------------------------------------------------------------
# Section 5 & 10: Production-Grade Hardened Vote Storage
# ---------------------------------------------------------------------------
class EncryptedVoteRecord(models.Model):
    """
    Production Column-Level Encrypted Vote Record.
    CRITICAL SECURITY PROPERTY:
    Contains strictly NO link, foreign key, or reference to student_id or voter profile.
    Ballot choice is encrypted with AES-256-GCM authenticated encryption.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='encrypted_votes')
    encrypted_vote_payload = models.TextField()  # JSON string containing ciphertext, nonce, and algorithm
    vote_hash = models.CharField(max_length=64, db_index=True)  # SHA-3-256
    nullifier_hash = models.CharField(max_length=64, unique=True, db_index=True)  # SHA-3-256 anti-double voting
    zk_proof_ref = models.CharField(max_length=128, blank=True)
    content_hash = models.CharField(max_length=64, blank=True)  # SHA-3 checksum
    audit_block_id = models.CharField(max_length=100, blank=True)
    vote_source = models.CharField(max_length=30, default='STUDENT_PORTAL')  # 'EVM_KIOSK' | 'STUDENT_PORTAL' | 'CAMPUS_LAB'
    kiosk_device_id = models.CharField(max_length=100, blank=True, default='')  # e.g. 'EVM-01'
    submitted_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Soft delete support for GDPR compliance

    def __str__(self):
        return f"EncryptedVote {str(self.id)[:8]}... [Source: {self.vote_source}]"


class ElectionCertificate(models.Model):
    """
    Cryptographically Certified Official Institutional Election Certificate.
    Provided to Winners, Contesting Candidates, and Participating Voters.
    Contains Candidate Symbol, Vote Tally, SHA-256 Hash Seal, and QR verification payload.
    """
    CERTIFICATE_TYPE_CHOICES = (
        ('WINNER', 'Certificate of Victory & Student Leadership Distinction'),
        ('CANDIDATE', 'Certificate of Democratic Candidacy & Honor'),
        ('VOTER', 'Certificate of Democratic Participation & Civic Responsibility'),
    )

    certificate_id = models.CharField(max_length=64, unique=True, db_index=True)
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPE_CHOICES)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='certificates')
    recipient_user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates')
    candidate = models.ForeignKey(Candidate, on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates')

    recipient_name = models.CharField(max_length=150)
    recipient_id = models.CharField(max_length=50)
    department = models.CharField(max_length=100, default='ALL')
    academic_year = models.CharField(max_length=20, default='2026')

    position_title = models.CharField(max_length=100, blank=True, default='')
    symbol = models.CharField(max_length=50, blank=True, default='★')
    symbol_name = models.CharField(max_length=100, blank=True, default='Star')
    votes_received = models.IntegerField(default=0)
    total_votes_cast = models.IntegerField(default=0)
    vote_percentage = models.FloatField(default=0.0)
    margin = models.IntegerField(default=0)

    block_index = models.IntegerField(default=1)
    block_hash = models.CharField(max_length=64, blank=True, default='')
    tx_id_ref = models.CharField(max_length=64, blank=True, default='')
    certificate_hash = models.CharField(max_length=64, db_index=True)
    qr_payload = models.TextField(blank=True, default='')

    issued_at = models.DateTimeField(auto_now_add=True)
    is_certified = models.BooleanField(default=True)
    institution_seal = models.CharField(max_length=150, default='ABC INSTITUTION - STUDENTVOICEX RETURNING BOARD')

    def save(self, *args, **kwargs):
        if not self.certificate_hash:
            data_to_hash = f"{self.certificate_id}:{self.certificate_type}:{self.recipient_id}:{self.votes_received}:{self.symbol}:{self.block_index}"
            self.certificate_hash = hashlib.sha256(data_to_hash.encode('utf-8')).hexdigest()
        if not self.qr_payload:
            self.qr_payload = f"STUDENTVOICEX-CERT:{self.certificate_id}:{self.recipient_id}:{self.certificate_hash[:16]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.certificate_type} - {self.recipient_name} ({self.certificate_id})"


class VoteAuditTrail(models.Model):
    """
    Section 10: Immutable Audit Table (`votes_audit`).
    Logs every state transition with content hash.
    """
    action = models.CharField(max_length=100)
    target_entity = models.CharField(max_length=150, blank=True)
    actor_hash = models.CharField(max_length=64, default='SYSTEM')
    details = models.TextField(blank=True)
    content_hash = models.CharField(max_length=64, blank=True)
    audit_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit: {self.action} on {self.target_entity} at {self.audit_timestamp.strftime('%Y-%m-%d %H:%M:%S')}"


class SecurityEvent(models.Model):
    SEVERITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    )
    EVENT_CHOICES = (
        ('FULLSCREEN_EXIT', 'Fullscreen Exited'),
        ('TAB_SWITCH', 'Tab Switched / Hidden'),
        ('WINDOW_FOCUS_LOST', 'Window Focus Lost'),
        ('CAMERA_PERMISSION_DENIED', 'Camera Permission Denied'),
        ('CAMERA_STREAM_STOPPED', 'Camera Stream Interrupted'),
        ('SESSION_TIMEOUT', 'Session Timeout'),
        ('MULTIPLE_LOGIN', 'Multiple Simultaneous Logins'),
        ('INVALID_TOKEN', 'Invalid Anonymous Token'),
        ('UNAUTHORIZED_ACCESS', 'Unauthorized Resource Access'),
        ('DUPLICATE_VOTE_ATTEMPT', 'Duplicate Vote Attempt Blocked'),
        ('BRUTE_FORCE_ATTEMPT', 'Brute Force Authentication Spike'),
        ('CRYPTO_VERIFICATION_FAIL', 'Cryptographic Verification Failure'),
        ('UNAUTHORIZED_NETWORK', 'Unauthorized External Network Attempt'),
        ('UNKNOWN_DEVICE', 'Unknown / Unregistered Device Blocked'),
        ('BLOCKED_DEVICE', 'Revoked / Blocked Device Attempt'),
        ('ACCESS_GRANTED', 'Campus Gateway Access Granted'),
        ('ACCESS_DENIED', 'Campus Gateway Access Denied'),
        ('DEVICE_REGISTERED', 'New Trusted Device Registered'),
        ('DEVICE_REVOKED', 'Trusted Device Access Revoked'),
        ('SESSION_STARTED', 'Campus Secure Session Started'),
        ('SESSION_TERMINATED', 'Campus Secure Session Terminated'),
    )

    event_type = models.CharField(max_length=50, choices=EVENT_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MEDIUM')
    student = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events')
    election = models.ForeignKey(Election, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_events')
    details = models.TextField()
    ip_address = models.CharField(max_length=50, default='127.0.0.1')
    user_agent = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.severity}] {self.event_type} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"


class CampusNetworkPolicy(models.Model):
    MODE_CHOICES = (
        ('STRICT', 'Strict Production Campus Access'),
        ('DEVELOPMENT', 'Development Mode (Local Network Allowed)'),
    )
    ssid_name = models.CharField(max_length=100, default='COLLEGE_WIFI')
    allowed_cidrs = models.TextField(default='127.0.0.1/32\n10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16\n::1/128')
    enforcement_mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='DEVELOPMENT')
    is_active = models.BooleanField(default=True)
    election_access_required = models.BooleanField(default=True)
    voting_start_time = models.CharField(max_length=10, default='09:00')
    voting_end_time = models.CharField(max_length=10, default='16:00')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Campus Network Policy ({self.ssid_name}) - {self.enforcement_mode}"


class DeviceRegistry(models.Model):
    STATUS_CHOICES = (
        ('TRUSTED', 'Trusted'),
        ('PENDING', 'Pending Approval'),
        ('BLOCKED', 'Blocked / Revoked'),
        ('EXPIRED', 'Expired'),
    )
    ROLE_CHOICES = (
        ('EVM', 'EVM Voting Kiosk'),
        ('ADMIN', 'Admin Terminal'),
        ('STUDENT_KIOSK', 'Student Campus Kiosk'),
        ('ALL', 'General Device'),
    )
    device_name = models.CharField(max_length=100)
    device_id = models.CharField(max_length=100, unique=True)
    department = models.CharField(max_length=100, default='IT Department')
    location = models.CharField(max_length=150, default='Voting Lab 1')
    role_target = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EVM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRUSTED')
    last_verified_ip = models.CharField(max_length=50, default='127.0.0.1')
    last_seen = models.DateTimeField(auto_now=True)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_name} ({self.device_id}) - [{self.status}]"


class AuditLog(models.Model):
    action = models.CharField(max_length=100)
    actor = models.CharField(max_length=100, default='System')
    target = models.CharField(max_length=150, blank=True, default='')
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} by {self.actor} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
