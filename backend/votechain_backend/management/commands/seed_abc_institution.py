"""
Seed command for ABC Institution VoteChain demonstration data.
"""
import uuid
import time
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from votechain_backend.models import (
    UserProfile, IDVerificationRecord, Election, Candidate,
    VoterEligibilityRecord, AnonymousVotingToken, SecurityEvent, AuditLog
)
from blockchain.core import blockchain_instance, Transaction as ChainTransaction

class Command(BaseCommand):
    help = "Seeds database with comprehensive ABC Institution election, student, and blockchain data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding ABC Institution database..."))

        # 1. Create Admin User
        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@abcinstitution.edu", "is_staff": True, "is_superuser": True}
        )
        admin_user.set_password("Admin@ABC2026")
        admin_user.save()

        UserProfile.objects.update_or_create(
            user=admin_user,
            defaults={
                "role": "ADMIN",
                "full_name": "Chief Election Administrator",
                "department": "Election Commission",
                "year": "Faculty",
                "section": "Lead",
                "phone": "+91 98765 43210",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Admin user created: admin / Admin@ABC2026"))

        # 1b. Create CEO / Executive User
        ceo_user, _ = User.objects.get_or_create(
            username="ceo",
            defaults={"email": "ceo@abcinstitution.edu", "is_staff": True}
        )
        ceo_user.set_password("CEO@ABC2026")
        ceo_user.save()

        UserProfile.objects.update_or_create(
            user=ceo_user,
            defaults={
                "role": "CEO",
                "full_name": "Dr. K. S. Ramanathan (Dean & CEO)",
                "department": "Executive Senate",
                "year": "Executive",
                "section": "Dean",
                "phone": "+91 98765 43211",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] CEO user created: ceo / CEO@ABC2026"))

        # 1c. Create EVM Kiosk User
        evm_user, _ = User.objects.get_or_create(
            username="evm_kiosk_01",
            defaults={"email": "evm01@abcinstitution.edu"}
        )
        evm_user.set_password("EVM@ABC2026")
        evm_user.save()

        UserProfile.objects.update_or_create(
            user=evm_user,
            defaults={
                "role": "EVM",
                "full_name": "EVM Terminal #01 (Main Kiosk)",
                "department": "Campus Kiosk Network",
                "year": "Terminal",
                "section": "Kiosk-01",
                "phone": "+91 98765 43212",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] EVM Kiosk user created: evm_kiosk_01 / EVM@ABC2026"))

        # 2. Create Sample Students
        students_data = [
            {
                "username": "STU2026001",
                "student_id": "STU2026001",
                "name": "Aarav Sharma",
                "department": "Information Technology",
                "year": "III",
                "section": "A",
                "email": "aarav.sharma@abcinstitution.edu",
                "phone": "+91 98450 11001",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026002",
                "student_id": "STU2026002",
                "name": "Priya Venkatesh",
                "department": "Computer Science & Engineering",
                "year": "IV",
                "section": "B",
                "email": "priya.v@abcinstitution.edu",
                "phone": "+91 98450 11002",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026003",
                "student_id": "STU2026003",
                "name": "Rohan Deshmukh",
                "department": "Electronics & Communication",
                "year": "III",
                "section": "A",
                "email": "rohan.d@abcinstitution.edu",
                "phone": "+91 98450 11003",
                "verification_status": "PENDING"
            },
            {
                "username": "STU2026004",
                "student_id": "STU2026004",
                "name": "Ananya Mukherjee",
                "department": "Information Technology",
                "year": "II",
                "section": "C",
                "email": "ananya.m@abcinstitution.edu",
                "phone": "+91 98450 11004",
                "verification_status": "UNDER_REVIEW"
            },
            {
                "username": "STU2026005",
                "student_id": "STU2026005",
                "name": "Karthik Raja",
                "department": "Mechanical Engineering",
                "year": "IV",
                "section": "A",
                "email": "karthik.r@abcinstitution.edu",
                "phone": "+91 98450 11005",
                "verification_status": "VERIFIED"
            }
        ]

        created_students = []
        for s in students_data:
            user, _ = User.objects.get_or_create(
                username=s["username"],
                defaults={"email": s["email"]}
            )
            user.set_password("Student@123")
            user.save()

            profile, _ = UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    "role": "STUDENT",
                    "student_id": s["student_id"],
                    "full_name": s["name"],
                    "department": s["department"],
                    "year": s["year"],
                    "section": s["section"],
                    "phone": s["phone"],
                    "id_card_number": f"ABC-ID-{s['student_id']}",
                    "eligibility": "ELIGIBLE",
                    "status": "ACTIVE",
                    "verification_status": s["verification_status"],
                    "temporary_password": "Student@123"
                }
            )
            created_students.append(profile)

            # Create ID Verification Record if verified
            if s["verification_status"] in ["VERIFIED", "UNDER_REVIEW"]:
                IDVerificationRecord.objects.get_or_create(
                    student=profile,
                    defaults={
                        "id_card_image": f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'><rect width='300' height='180' fill='%23f1f5f9' rx='8'/><text x='20' y='40' font-family='sans-serif' font-weight='bold' fill='%230f172a'>ABC INSTITUTION</text><text x='20' y='70' font-family='sans-serif' fill='%23475569'>Student ID: {s['student_id']}</text><text x='20' y='95' font-family='sans-serif' fill='%23475569'>Name: {s['name']}</text><text x='20' y='120' font-family='sans-serif' fill='%23475569'>Dept: {s['department']}</text><circle cx='250' cy='60' r='30' fill='%230284c7'/></svg>",
                        "extracted_id_number": s["student_id"],
                        "match_score": 99.4,
                        "status": s["verification_status"],
                        "admin_notes": "Institution smart card check passed."
                    }
                )

        self.stdout.write(self.style.SUCCESS(f"[OK] Provisioned {len(created_students)} sample students."))

        # 3. Create Elections
        election1, _ = Election.objects.get_or_create(
            title="ABC Institution - Student Council President Election 2026",
            defaults={
                "description": "Annual institutional election for the Student Council President representing all academic departments of ABC Institution.",
                "start_date": timezone.now() - timezone.timedelta(hours=2),
                "end_date": timezone.now() + timezone.timedelta(days=1),
                "status": "ACTIVE",
                "camera_required": True,
                "id_verification_required": True,
                "rules": "1. Mandatory controlled fullscreen voting session.\n2. Switching tabs or minimizing browser will log detectable security telemetry.\n3. Active webcam live-preview check required.\n4. Zero-linkage anonymous cryptographic ballot.\n5. Exactly one vote allowed per verified student."
            }
        )

        election2, _ = Election.objects.get_or_create(
            title="ABC Institution - Department Representative (IT & CS)",
            defaults={
                "description": "Departmental representative ballot for academic curriculum, laboratory facilities, and tech symposium leadership.",
                "start_date": timezone.now() - timezone.timedelta(hours=1),
                "end_date": timezone.now() + timezone.timedelta(days=2),
                "status": "ACTIVE",
                "camera_required": True,
                "id_verification_required": True,
                "rules": "1. Fullscreen mode required.\n2. Single anonymous vote."
            }
        )

        # 4. Create Candidates for Election 1
        candidates_data_e1 = [
            {
                "candidate_id": "CAN-2026-01",
                "name": "Devika Raman",
                "department": "Information Technology",
                "year": "III",
                "section": "A",
                "manifesto": "Championing transparent student representation, 24/7 campus innovation labs, and modern coding hackathons for ABC Institution."
            },
            {
                "candidate_id": "CAN-2026-02",
                "name": "Siddharth Verma",
                "department": "Computer Science & Engineering",
                "year": "IV",
                "section": "B",
                "manifesto": "Empowering cross-departmental research collaborations, streamlined academic feedback, and career mentorship initiatives."
            },
            {
                "candidate_id": "CAN-2026-03",
                "name": "Meera Krishnan",
                "department": "Electronics & Communication",
                "year": "III",
                "section": "B",
                "manifesto": "Promoting sustainable campus infrastructure, student mental wellness hubs, and inter-collegiate sports expansion."
            }
        ]

        for c in candidates_data_e1:
            Candidate.objects.update_or_create(
                candidate_id=c["candidate_id"],
                election=election1,
                defaults={
                    "name": c["name"],
                    "department": c["department"],
                    "year": c["year"],
                    "section": c["section"],
                    "manifesto": c["manifesto"],
                    "vote_count": 0
                }
            )

        # Candidates for Election 2
        candidates_data_e2 = [
            {
                "candidate_id": "CAN-IT-01",
                "name": "Aditya Sengupta",
                "department": "Information Technology",
                "year": "III",
                "section": "A",
                "manifesto": "Cloud infrastructure lab upgrades, open source workshop series, and peer-to-peer code review circles."
            },
            {
                "candidate_id": "CAN-IT-02",
                "name": "Tanvi Joshi",
                "department": "Computer Science & Engineering",
                "year": "III",
                "section": "C",
                "manifesto": "AI research study groups, female tech leadership programs, and competitive programming bootcamps."
            }
        ]

        for c in candidates_data_e2:
            Candidate.objects.update_or_create(
                candidate_id=c["candidate_id"],
                election=election2,
                defaults={
                    "name": c["name"],
                    "department": c["department"],
                    "year": c["year"],
                    "section": c["section"],
                    "manifesto": c["manifesto"],
                    "vote_count": 0
                }
            )

        # 5. Enroll Students in Eligibility Records
        for student in created_students:
            VoterEligibilityRecord.objects.get_or_create(
                student=student,
                election=election1,
                defaults={"has_voted": False}
            )
            VoterEligibilityRecord.objects.get_or_create(
                student=student,
                election=election2,
                defaults={"has_voted": False}
            )

        # 6. Seed Sample Security Events for Demo Telemetry
        SecurityEvent.objects.get_or_create(
            event_type="TAB_SWITCH",
            severity="LOW",
            student=created_students[2],
            election=election1,
            defaults={"details": "Browser tab switched to background for 1.2 seconds during ballot inspection"}
        )
        SecurityEvent.objects.get_or_create(
            event_type="FULLSCREEN_EXIT",
            severity="MEDIUM",
            student=created_students[3],
            election=election1,
            defaults={"details": "Student pressed ESC key; voting session paused and warning modal displayed"}
        )
        SecurityEvent.objects.get_or_create(
            event_type="CAMERA_STREAM_STOPPED",
            severity="HIGH",
            student=created_students[0],
            election=election1,
            defaults={"details": "Webcam stream disconnected temporarily during pre-session verification"}
        )

        # 7. Seed Initial Mined Blockchain Blocks (Clean Genesis Block Only)
        self.stdout.write("Initializing fresh genesis block on VoteChain ledger...")
        blockchain_instance.chain = []
        blockchain_instance.mempool = []
        blockchain_instance.used_nullifiers = set()
        blockchain_instance.create_genesis_block()
        blockchain_instance.save_ledger()

        # 8. Audit Logs
        AuditLog.objects.create(
            action="SYSTEM_INITIALIZED",
            actor="System Admin",
            target="ABC Institution Election Portal",
            details="VoteChain platform initialized with RSA cryptography and PoW blockchain."
        )

        self.stdout.write(self.style.SUCCESS("[OK] ABC Institution VoteChain seeding completed successfully!"))
