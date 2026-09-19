from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
import json

from .models import UserProfile, Election, Candidate, VoterEligibilityRecord, AnonymousVotingToken, EncryptedVoteRecord
from blockchain.core import blockchain_instance, AuditTransaction
from blockchain.crypto_utils import (
    sha3_256_hash, sha3_512_hash, sign_payload_ed25519, verify_signature_ed25519,
    encrypt_aes_256_gcm, decrypt_aes_256_gcm, generate_totp_secret,
    generate_totp_code, verify_totp_code
)

class VoteChainTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        blockchain_instance.create_genesis_block()

        # Create Admin with MFA enabled
        self.admin_user = User.objects.create_user(username="admin_test", password="password123")
        self.totp_secret = generate_totp_secret()
        self.admin_profile = UserProfile.objects.create(
            user=self.admin_user,
            role="ADMIN",
            full_name="Admin Test",
            department="Computer Science",
            mfa_enabled=True,
            totp_secret=self.totp_secret
        )

        # Create Student
        self.student_user = User.objects.create_user(username="student_test", password="password123")
        self.student_profile = UserProfile.objects.create(
            user=self.student_user,
            role="STUDENT",
            student_id="STU2026001",
            full_name="Student One",
            department="Information Technology",
            verification_status="VERIFIED",
            eligibility="ELIGIBLE"
        )

        # Create Election & Candidate
        self.election = Election.objects.create(
            title="General Council 2026",
            department="ALL",
            start_date=timezone.now() - timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status="ACTIVE",
            camera_required=False,
            id_verification_required=True
        )
        self.candidate = Candidate.objects.create(
            candidate_id="CAND-01",
            election=self.election,
            name="Alice Walker",
            department="Information Technology"
        )

    def test_cryptographic_sha3_and_ed25519(self):
        """Validates Section 3 SHA-3-256 hashing and Ed25519 digital signatures."""
        payload = {"election_id": 1, "choice": "Candidate A", "timestamp": "2026-09-18T12:00:00Z"}
        digest = sha3_256_hash(payload)
        self.assertEqual(len(digest), 64)

        signature = sign_payload_ed25519(payload)
        self.assertTrue(verify_signature_ed25519(payload, signature))

    def test_aes_256_gcm_aead_encryption(self):
        """Validates Section 3 AES-256-GCM authenticated encryption."""
        message = {"candidate": "CAND-01", "voter_ticket": "SECRET-12345"}
        bundle = encrypt_aes_256_gcm(message)
        self.assertEqual(bundle["algorithm"], "AES-256-GCM")
        self.assertIn("ciphertext", bundle)
        self.assertIn("nonce", bundle)

        decrypted = decrypt_aes_256_gcm(bundle)
        self.assertIn("CAND-01", decrypted)

    def test_totp_mfa_generation_and_verification(self):
        """Validates Section 4 RFC 6238 TOTP verification."""
        secret = generate_totp_secret()
        code = generate_totp_code(secret)
        self.assertEqual(len(code), 6)
        self.assertTrue(verify_totp_code(secret, code))
        self.assertFalse(verify_totp_code(secret, "999999" if code != "999999" else "000000"))

    def test_login_mfa_challenge_flow(self):
        """Tests that login properly prompts for MFA code and succeeds when provided."""
        # Attempt login without MFA code -> returns mfa_required
        res1 = self.client.post('/api/auth/login/', {
            "username": "admin_test",
            "password": "password123"
        })
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertTrue(res1.data.get("mfa_required"))

        # Submit with valid TOTP code
        valid_code = generate_totp_code(self.totp_secret)
        res2 = self.client.post('/api/auth/login/', {
            "username": "admin_test",
            "password": "password123",
            "mfa_code": valid_code
        })
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertIn("token", res2.data)
        self.assertEqual(res2.data.get("role"), "ADMIN")

    def test_column_encrypted_vote_and_audit_block(self):
        """Tests full voting flow: ephemeral encryption, DB record with zero voter linkage, and BFT block finalization."""
        # 1. Initialize session
        init_res = self.client.post('/api/voting/session-init/', {
            "student_id": "STU2026001",
            "election_id": self.election.id
        })
        self.assertEqual(init_res.status_code, status.HTTP_200_OK)
        token = init_res.data.get("anonymousToken")
        self.assertTrue(token)

        # 2. Cast vote
        cast_res = self.client.post('/api/voting/cast/', {
            "student_id": "STU2026001",
            "election_id": self.election.id,
            "candidate_id": self.candidate.id,
            "anonymous_token": token
        })
        self.assertEqual(cast_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(cast_res.data.get("blockchainStatus"), "FINALIZED")
        self.assertTrue(cast_res.data.get("voteHash"))
        self.assertTrue(cast_res.data.get("proofVerified"))

        # Verify DB EncryptedVoteRecord has NO student_id column
        encrypted_records = EncryptedVoteRecord.objects.filter(election=self.election)
        self.assertEqual(encrypted_records.count(), 1)
        record = encrypted_records.first()
        self.assertTrue(record.encrypted_vote_payload)
        self.assertTrue(record.nullifier_hash)
        self.assertFalse(hasattr(record, "student"))
        self.assertFalse(hasattr(record, "student_id"))
