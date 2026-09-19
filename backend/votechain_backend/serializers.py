from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, IDVerificationRecord, Election, Candidate,
    VoterEligibilityRecord, AnonymousVotingToken, SecurityEvent, AuditLog,
    Notification, CampusNetworkPolicy, DeviceRegistry, ElectionCertificate
)

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'role', 'student_id', 'roll_number', 'full_name',
            'department', 'year', 'section', 'phone', 'profile_photo',
            'id_card_number', 'id_card_hash', 'id_card_qr_ref', 'eligibility',
            'status', 'verification_status', 'temporary_password', 'mfa_enabled',
            'hardware_key_registered', 'created_at', 'updated_at'
        ]


class CandidateSerializer(serializers.ModelSerializer):
    election_title = serializers.CharField(source='election.title', read_only=True)

    class Meta:
        model = Candidate
        fields = [
            'id', 'candidate_id', 'election', 'election_title', 'name',
            'position', 'department', 'year', 'section', 'profile_photo',
            'election_symbol', 'symbol_name', 'biography', 'manifesto',
            'priorities', 'status', 'vote_count', 'created_at'
        ]


class ElectionSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(many=True, read_only=True)
    total_votes = serializers.SerializerMethodField()
    eligible_voter_count = serializers.SerializerMethodField()
    positions = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = [
            'id', 'title', 'description', 'academic_year', 'department',
            'eligible_departments', 'eligible_years', 'start_date', 'end_date',
            'daily_start_time', 'daily_end_time', 'voting_hours_enforced', 'status',
            'camera_required', 'id_verification_required', 'rules',
            'created_at', 'updated_at', 'candidates', 'total_votes', 'eligible_voter_count',
            'positions'
        ]

    def get_total_votes(self, obj):
        return sum(c.vote_count for c in obj.candidates.all())

    def get_eligible_voter_count(self, obj):
        return obj.voter_records.count()

    def get_positions(self, obj):
        # Extract unique positions from approved candidates
        positions = list(obj.candidates.values_list('position', flat=True).distinct())
        if not positions:
            positions = ['President', 'Vice President', 'Secretary']
        return positions


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'notification_type', 'created_at']


class IDVerificationRecordSerializer(serializers.ModelSerializer):
    student_details = UserProfileSerializer(source='student', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True)

    class Meta:
        model = IDVerificationRecord
        fields = [
            'id', 'student', 'student_details', 'id_card_image', 'document_hash',
            'extracted_id_number', 'match_score', 'status', 'admin_notes',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at', 'submitted_at'
        ]


class SecurityEventSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    election_title = serializers.CharField(source='election.title', read_only=True)

    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'event_type', 'severity', 'student', 'student_name',
            'student_id', 'election', 'election_title', 'details',
            'ip_address', 'user_agent', 'timestamp'
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'actor', 'target', 'details', 'timestamp']


class CampusNetworkPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusNetworkPolicy
        fields = [
            'id', 'ssid_name', 'allowed_cidrs', 'enforcement_mode', 'is_active',
            'election_access_required', 'voting_start_time', 'voting_end_time', 'updated_at'
        ]


class DeviceRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceRegistry
        fields = [
            'id', 'device_name', 'device_id', 'department', 'location',
            'role_target', 'status', 'last_verified_ip', 'last_seen', 'registration_date'
        ]


class ElectionCertificateSerializer(serializers.ModelSerializer):
    election_title = serializers.CharField(source='election.title', read_only=True)

    class Meta:
        model = ElectionCertificate
        fields = [
            'id', 'certificate_id', 'certificate_type', 'election', 'election_title',
            'recipient_user', 'candidate', 'recipient_name', 'recipient_id',
            'department', 'academic_year', 'position_title', 'symbol', 'symbol_name',
            'votes_received', 'total_votes_cast', 'vote_percentage', 'margin',
            'block_index', 'block_hash', 'tx_id_ref', 'certificate_hash',
            'qr_payload', 'issued_at', 'is_certified', 'institution_seal'
        ]
