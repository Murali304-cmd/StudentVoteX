"""
Seed command for StudentVoiceX ABC Institution demo dataset.
Usage: python manage.py seed_demo
"""
import uuid
import hashlib
import time
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from votechain_backend.models import (
    UserProfile, IDVerificationRecord, Election, Candidate,
    VoterEligibilityRecord, AnonymousVotingToken, SecurityEvent, AuditLog,
    Notification
)
from blockchain.core import blockchain_instance, Transaction as ChainTransaction

class Command(BaseCommand):
    help = "Seeds database with comprehensive StudentVoiceX ABC Institution demonstration data (1 Admin, 2 EVM, 10 Students, 2 Elections, Candidates, Blockchain)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding StudentVoiceX ABC Institution database..."))

        # 1. Create System Administrator
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
                "full_name": "Dr. Sarah Jenkins (Chief Election Officer)",
                "department": "Election Commission",
                "year": "Faculty",
                "section": "Lead",
                "phone": "+91 98765 43210",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Admin created: admin / Admin@ABC2026"))

        # 2. Create 2 EVM Users
        evm1_user, _ = User.objects.get_or_create(
            username="evm_kiosk_01",
            defaults={"email": "evm01@abcinstitution.edu"}
        )
        evm1_user.set_password("EVM@ABC2026")
        evm1_user.save()

        UserProfile.objects.update_or_create(
            user=evm1_user,
            defaults={
                "role": "EVM",
                "full_name": "EVM Kiosk Station #01 (Main Campus Auditorium)",
                "department": "Campus Kiosk Network",
                "year": "Terminal",
                "section": "Kiosk-01",
                "phone": "+91 98765 43211",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )

        evm2_user, _ = User.objects.get_or_create(
            username="evm_kiosk_02",
            defaults={"email": "evm02@abcinstitution.edu"}
        )
        evm2_user.set_password("EVM@ABC2026")
        evm2_user.save()

        UserProfile.objects.update_or_create(
            user=evm2_user,
            defaults={
                "role": "EVM",
                "full_name": "EVM Kiosk Station #02 (Library West Wing)",
                "department": "Campus Kiosk Network",
                "year": "Terminal",
                "section": "Kiosk-02",
                "phone": "+91 98765 43212",
                "eligibility": "INELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] 2 EVM users created: evm_kiosk_01, evm_kiosk_02 / EVM@ABC2026"))

        # 3. Create 10 Demo Students
        students_data = [
            {
                "username": "STU2026001",
                "student_id": "ABC-IT-2026-001",
                "roll_number": "2024IT001",
                "name": "Muralidharan K",
                "department": "Information Technology",
                "year": "3rd Year",
                "section": "A",
                "email": "muralidharan.k@abcinstitution.edu",
                "phone": "+91 98450 11001",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026002",
                "student_id": "ABC-CS-2026-002",
                "roll_number": "2024CS002",
                "name": "Priya Venkatesh",
                "department": "Computer Science & Engineering",
                "year": "4th Year",
                "section": "B",
                "email": "priya.v@abcinstitution.edu",
                "phone": "+91 98450 11002",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026003",
                "student_id": "ABC-EE-2026-003",
                "roll_number": "2024EE003",
                "name": "Rohan Deshmukh",
                "department": "Electronics & Communication",
                "year": "3rd Year",
                "section": "A",
                "email": "rohan.d@abcinstitution.edu",
                "phone": "+91 98450 11003",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026004",
                "student_id": "ABC-IT-2026-004",
                "roll_number": "2024IT004",
                "name": "Ananya Mukherjee",
                "department": "Information Technology",
                "year": "2nd Year",
                "section": "C",
                "email": "ananya.m@abcinstitution.edu",
                "phone": "+91 98450 11004",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026005",
                "student_id": "ABC-ME-2026-005",
                "roll_number": "2024ME005",
                "name": "Karthik Raja",
                "department": "Mechanical Engineering",
                "year": "4th Year",
                "section": "A",
                "email": "karthik.r@abcinstitution.edu",
                "phone": "+91 98450 11005",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026006",
                "student_id": "ABC-CS-2026-006",
                "roll_number": "2024CS006",
                "name": "Sneha Reddy",
                "department": "Computer Science & Engineering",
                "year": "3rd Year",
                "section": "A",
                "email": "sneha.r@abcinstitution.edu",
                "phone": "+91 98450 11006",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026007",
                "student_id": "ABC-CV-2026-007",
                "roll_number": "2024CV007",
                "name": "Vikram Sethi",
                "department": "Civil Engineering",
                "year": "2nd Year",
                "section": "B",
                "email": "vikram.s@abcinstitution.edu",
                "phone": "+91 98450 11007",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026008",
                "student_id": "ABC-BT-2026-008",
                "roll_number": "2024BT008",
                "name": "Divya Nambiar",
                "department": "Biotechnology",
                "year": "1st Year",
                "section": "A",
                "email": "divya.n@abcinstitution.edu",
                "phone": "+91 98450 11008",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026009",
                "student_id": "ABC-EE-2026-009",
                "roll_number": "2024EE009",
                "name": "Harshvardhan Patel",
                "department": "Electrical & Electronics",
                "year": "3rd Year",
                "section": "B",
                "email": "harsh.p@abcinstitution.edu",
                "phone": "+91 98450 11009",
                "verification_status": "VERIFIED"
            },
            {
                "username": "STU2026010",
                "student_id": "ABC-IT-2026-010",
                "roll_number": "2024IT010",
                "name": "Meenakshi Sundaram",
                "department": "Information Technology",
                "year": "4th Year",
                "section": "A",
                "email": "meenakshi.s@abcinstitution.edu",
                "phone": "+91 98450 11010",
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

            id_hash = hashlib.sha256(f"{s['student_id']}:{s['name']}:ABC-INSTITUTION".encode()).hexdigest()

            profile, _ = UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    "role": "STUDENT",
                    "student_id": s["student_id"],
                    "roll_number": s["roll_number"],
                    "full_name": s["name"],
                    "department": s["department"],
                    "year": s["year"],
                    "section": s["section"],
                    "phone": s["phone"],
                    "id_card_number": s["student_id"],
                    "id_card_hash": id_hash,
                    "id_card_qr_ref": f"ABC-VERIFY:{s['student_id']}:{id_hash[:16]}",
                    "eligibility": "ELIGIBLE",
                    "status": "ACTIVE",
                    "verification_status": s["verification_status"],
                    "temporary_password": "Student@123"
                }
            )
            created_students.append(profile)

            # Create ID Verification Record for all verified students
            IDVerificationRecord.objects.filter(student=profile).delete()
            IDVerificationRecord.objects.create(
                student=profile,
                id_card_image=f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='320' height='200' fill='%23f8fafc' rx='10' stroke='%23cbd5e1' stroke-width='2'/><text x='20' y='35' font-family='sans-serif' font-weight='bold' font-size='14' fill='%230f172a'>ABC INSTITUTION</text><text x='20' y='55' font-family='sans-serif' font-size='10' fill='%230284c7'>STUDENT ID CARD</text><text x='20' y='90' font-family='sans-serif' font-weight='bold' font-size='12' fill='%230f172a'>{s['name']}</text><text x='20' y='112' font-family='sans-serif' font-size='11' fill='%23475569'>Roll No: {s['roll_number']}</text><text x='20' y='132' font-family='sans-serif' font-size='11' fill='%23475569'>{s['department']}</text><text x='20' y='152' font-family='sans-serif' font-size='11' fill='%23475569'>{s['year']}</text><text x='20' y='178' font-family='monospace' font-weight='bold' font-size='10' fill='%230284c7'>{s['student_id']}</text><rect x='230' y='40' width='70' height='70' fill='%230284c7' rx='6'/><text x='245' y='80' font-family='sans-serif' font-size='20' fill='%23ffffff'>QR</text></svg>",
                extracted_id_number=s["student_id"],
                match_score=99.6,
                status="VERIFIED",
                admin_notes="Official institutional smartcard check passed."
            )

            # Create Welcome Notification
            Notification.objects.filter(user=profile).delete()
            Notification.objects.create(
                user=profile,
                title="Welcome to StudentVoiceX!",
                message=f"Hello {s['name']}, your institutional digital voting profile is active for ABC Institution.",
                notification_type="WELCOME"
            )

        self.stdout.write(self.style.SUCCESS(f"[OK] Provisioned {len(created_students)} demo students."))

        # 4. Create 2 Elections
        election1, _ = Election.objects.get_or_create(
            title="ABC Institution - Student Council President Election 2026",
            defaults={
                "description": "Official institutional election for the Student Council President representing all academic departments of ABC Institution.",
                "academic_year": "2026-2027",
                "department": "ALL",
                "eligible_departments": "Information Technology, Computer Science, Electronics, Mechanical, Civil, Biotechnology",
                "eligible_years": "1st Year, 2nd Year, 3rd Year, 4th Year",
                "start_date": timezone.now() - timezone.timedelta(hours=3),
                "end_date": timezone.now() + timezone.timedelta(days=2),
                "status": "ACTIVE",
                "camera_required": True,
                "id_verification_required": True,
                "rules": "1. Controlled session required.\n2. Biometric and camera monitoring active.\n3. Ephemeral key ballot encryption.\n4. Single vote for President."
            }
        )

        election2, _ = Election.objects.get_or_create(
            title="ABC Institution - Technical & Innovation Council Election 2026",
            defaults={
                "description": "Departmental and innovation representative ballot for laboratory development, symposium leadership, and hackathons.",
                "academic_year": "2026-2027",
                "department": "Engineering & Technology",
                "eligible_departments": "Information Technology, Computer Science, Electronics, Mechanical",
                "eligible_years": "2nd Year, 3rd Year, 4th Year",
                "start_date": timezone.now() - timezone.timedelta(hours=1),
                "end_date": timezone.now() + timezone.timedelta(days=3),
                "status": "ACTIVE",
                "camera_required": True,
                "id_verification_required": True,
                "rules": "1. Mandatory student verification.\n2. Single anonymous cryptographic vote per eligible student."
            }
        )

        # 5. Create 6 Candidates for President Election
        candidates_data_e1 = [
            {
                "candidate_id": "CAN-PRES-01",
                "name": "Arun Kumar",
                "position": "President",
                "department": "Computer Science & Engineering",
                "year": "4th Year",
                "section": "A",
                "symbol": "★",
                "symbol_name": "Star",
                "bio": "Dedicated to student innovation, AI labs, and high-speed campus tech incubators.",
                "priorities": "• 24/7 Campus Innovation Labs\n• Tier-1 Placement Training\n• Campus High-Speed Wi-Fi\n• Research Grants & Hackathons"
            },
            {
                "candidate_id": "CAN-PRES-02",
                "name": "Devika Raman",
                "position": "President",
                "department": "Information Technology",
                "year": "4th Year",
                "section": "B",
                "symbol": "⚡",
                "symbol_name": "Lightning Bolt",
                "bio": "Student welfare champion focusing on transparent council budgeting and campus-wide inclusivity.",
                "priorities": "• Transparent Student Council Fund\n• Mental Wellness & Health Wing\n• Inter-College Hackathon Sponsorship\n• Eco-Campus Green Initiative"
            },
            {
                "candidate_id": "CAN-PRES-03",
                "name": "Siddharth Verma",
                "position": "President",
                "department": "Electronics & Communication Engineering",
                "year": "4th Year",
                "section": "A",
                "symbol": "🏛️",
                "symbol_name": "Crest Dome",
                "bio": "Hardware innovator passionate about robotics, drone research, and deep-tech industry internships.",
                "priorities": "• Core Hardware Industry Alliances\n• Robotics & IoT Maker Labs\n• National Technical Symposiums\n• Hostel Living Infrastructure"
            },
            {
                "candidate_id": "CAN-PRES-04",
                "name": "Meera Krishnan",
                "position": "President",
                "department": "Mechanical Engineering",
                "year": "4th Year",
                "section": "C",
                "symbol": "⚙️",
                "symbol_name": "Gear Wheel",
                "bio": "Formula student captain and athletic leader committed to collegiate sports and hands-on fabrication.",
                "priorities": "• Sports Complex & Turf Upgrade\n• Cafeteria Food Quality Audit\n• Design & 3D Fabrication Labs\n• Campus Night Transport Fleet"
            },
            {
                "candidate_id": "CAN-PRES-05",
                "name": "Rohan Deshmukh",
                "position": "President",
                "department": "Electrical & Electronics Engineering",
                "year": "4th Year",
                "section": "A",
                "symbol": "📖",
                "symbol_name": "Open Book",
                "bio": "Academic mentor and researcher committed to student grievance redressal and digital library modernization.",
                "priorities": "• 24/7 Digital Library & Journal Access\n• Student Grievance Fast-Track Cell\n• Merit & Need-Based Scholarships\n• Free Professional Certifications"
            },
            {
                "candidate_id": "CAN-PRES-06",
                "name": "Ananya Sharma",
                "position": "President",
                "department": "Biotechnology & Chemical Engineering",
                "year": "4th Year",
                "section": "B",
                "symbol": "🚀",
                "symbol_name": "Rocket",
                "bio": "Biotech researcher and entrepreneurship lead driving sustainable green campus innovations and student startups.",
                "priorities": "• Student Startup Incubation Seed Fund\n• Cultural Fest Modernization\n• Global Alumni Mentorship Network\n• Solar & Zero-Waste Campus Drive"
            }
        ]

        for c in candidates_data_e1:
            Candidate.objects.update_or_create(
                candidate_id=c["candidate_id"],
                election=election1,
                defaults={
                    "name": c["name"],
                    "position": c["position"],
                    "department": c["department"],
                    "year": c["year"],
                    "section": c["section"],
                    "election_symbol": c["symbol"],
                    "symbol_name": c["symbol_name"],
                    "biography": c["bio"],
                    "manifesto": c["bio"],
                    "priorities": c["priorities"],
                    "status": "APPROVED",
                    "vote_count": 0
                }
            )

        # Candidates for Election 2 (Tech Council)
        candidates_data_e2 = [
            {
                "candidate_id": "CAN-TECH-01",
                "name": "Aditya Sengupta",
                "position": "Lead Tech Coordinator",
                "department": "Information Technology",
                "year": "3rd Year",
                "section": "A",
                "symbol": "🚀",
                "symbol_name": "Rocket",
                "bio": "Cloud computing enthusiast organizing AWS/GCP workshops and open-source contribution drives.",
                "priorities": "• Cloud Dev Grants\n• Open Source Month\n• AI Research Circles"
            },
            {
                "candidate_id": "CAN-TECH-02",
                "name": "Tanvi Joshi",
                "position": "Lead Tech Coordinator",
                "department": "Computer Science & Engineering",
                "year": "3rd Year",
                "section": "C",
                "symbol": "💻",
                "symbol_name": "Laptop",
                "bio": "Competitive programmer driving international ICPC training and student startup incubator.",
                "priorities": "• Competitive Coding Bootcamps\n• Startup Incubator Pitch Days\n• Hardware Hackathons"
            }
        ]

        for c in candidates_data_e2:
            Candidate.objects.update_or_create(
                candidate_id=c["candidate_id"],
                election=election2,
                defaults={
                    "name": c["name"],
                    "position": c["position"],
                    "department": c["department"],
                    "year": c["year"],
                    "section": c["section"],
                    "election_symbol": c["symbol"],
                    "symbol_name": c["symbol_name"],
                    "biography": c["bio"],
                    "manifesto": c["bio"],
                    "priorities": c["priorities"],
                    "status": "APPROVED",
                    "vote_count": 0
                }
            )

        # 6. Enroll Students in Eligibility Records
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

        # 7. Seed Sample Security Events
        SecurityEvent.objects.get_or_create(
            event_type="TAB_SWITCH",
            severity="LOW",
            student=created_students[2],
            election=election1,
            defaults={"details": "Browser tab switched to background during ballot inspection"}
        )
        SecurityEvent.objects.get_or_create(
            event_type="FULLSCREEN_EXIT",
            severity="MEDIUM",
            student=created_students[3],
            election=election1,
            defaults={"details": "Student pressed ESC; voting session paused and warning displayed"}
        )
        SecurityEvent.objects.get_or_create(
            event_type="CAMERA_STREAM_STOPPED",
            severity="HIGH",
            student=created_students[0],
            election=election1,
            defaults={"details": "Webcam stream disconnected temporarily during pre-session verification"}
        )

        # 8. Seed Initial Blockchain Genesis Block
        self.stdout.write("Initializing fresh genesis block on VotaNova audit ledger...")
        blockchain_instance.chain = []
        blockchain_instance.mempool = []
        blockchain_instance.used_nullifiers = set()
        blockchain_instance.create_genesis_block()
        blockchain_instance.save_ledger()

        # 9. Audit Logs
        AuditLog.objects.create(
            action="SYSTEM_INITIALIZED",
            actor="System Admin",
            target="ABC Institution StudentVoiceX Portal",
            details="StudentVoiceX platform initialized with RSA cryptography and PoW/PoA permissioned blockchain."
        )

        self.stdout.write(self.style.SUCCESS("\n[SUCCESS] StudentVoiceX ABC Institution seed_demo completed successfully!"))
        self.stdout.write(self.style.SUCCESS("----------------------------------------------------------------------"))
        self.stdout.write(self.style.SUCCESS("Admin: admin / Admin@ABC2026"))
        self.stdout.write(self.style.SUCCESS("EVM 1: evm_kiosk_01 / EVM@ABC2026"))
        self.stdout.write(self.style.SUCCESS("EVM 2: evm_kiosk_02 / EVM@ABC2026"))
        self.stdout.write(self.style.SUCCESS("Students: STU2026001 to STU2026010 / Student@123"))
        self.stdout.write(self.style.SUCCESS("----------------------------------------------------------------------"))
