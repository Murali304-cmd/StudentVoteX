import os
import django
import hashlib
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'votechain_server.settings')
django.setup()

from django.contrib.auth.models import User
from votechain_backend.models import (
    UserProfile, IDVerificationRecord, Election, Candidate,
    VoterEligibilityRecord, AnonymousVotingToken, SecurityEvent, AuditLog,
    Notification, Department, CampusNetworkPolicy, DeviceRegistry
)

def populate():
    print("--- Verifying & Enriching Institutional Database ---")

    # 1. Ensure Admin & Password
    admin_user, _ = User.objects.get_or_create(
        username="admin",
        defaults={"email": "admin@abcinstitution.edu", "is_staff": True, "is_superuser": True}
    )
    admin_user.set_password("Admin@ABC2026")
    admin_user.is_staff = True
    admin_user.is_superuser = True
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
    print("[OK] Admin verified: admin / Admin@ABC2026")

    # 2. Ensure CEO
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
            "verification_status": "VERIFIED",
            "temporary_password": "CEO@ABC2026"
        }
    )
    print("[OK] CEO verified: ceo / CEO@ABC2026")

    # 3. Seed EVM Stations
    evm_stations_data = [
        {
            "username": "evm_kiosk_01",
            "name": "EVM Terminal #01 (CSE Lab 301)",
            "department": "Computer Science & Engineering",
            "section": "Kiosk-01",
            "pin": "EVM@ABC2026"
        },
        {
            "username": "evm_kiosk_02",
            "name": "EVM Terminal #02 (Main Auditorium)",
            "department": "Campus Main Hall",
            "section": "Kiosk-02",
            "pin": "EVM@ABC2026"
        },
        {
            "username": "evm_kiosk_03",
            "name": "EVM Terminal #03 (Tech Block 201)",
            "department": "Information Technology",
            "section": "Kiosk-03",
            "pin": "EVM@ABC2026"
        }
    ]

    for evm in evm_stations_data:
        evm_u, _ = User.objects.get_or_create(
            username=evm["username"],
            defaults={"email": f"{evm['username']}@abcinstitution.edu"}
        )
        evm_u.set_password(evm["pin"])
        evm_u.save()

        UserProfile.objects.update_or_create(
            user=evm_u,
            defaults={
                "role": "EVM",
                "full_name": evm["name"],
                "department": evm["department"],
                "year": "Terminal",
                "section": evm["section"],
                "phone": "+91 98765 43200",
                "eligibility": "INELIGIBLE",
                "status": "ONLINE",
                "verification_status": "VERIFIED",
                "temporary_password": evm["pin"]
            }
        )
    print(f"[OK] Seeded {len(evm_stations_data)} EVM Stations (role='EVM').")

    # 4. Ensure Student 1: Muralidharan K
    stu1_user, _ = User.objects.get_or_create(
        username="STU2026001",
        defaults={"email": "muralidharanprathap@gmail.com"}
    )
    stu1_user.set_password("Student@123")
    stu1_user.save()

    p1, _ = UserProfile.objects.update_or_create(
        user=stu1_user,
        defaults={
            "role": "STUDENT",
            "student_id": "ABC-IT-2026-001",
            "roll_number": "STU2026IT001",
            "full_name": "Muralidharan K",
            "department": "Information Technology",
            "year": "3rd Year",
            "section": "A",
            "phone": "+91 7639170303",
            "id_card_number": "ABC-IT-2026-001",
            "id_card_hash": hashlib.sha256("ABC-IT-2026-001:Muralidharan K:ABC-INSTITUTION".encode()).hexdigest(),
            "id_card_qr_ref": "ABC-VERIFY:ABC-IT-2026-001:8f92a10",
            "eligibility": "ELIGIBLE",
            "status": "ACTIVE",
            "verification_status": "VERIFIED",
            "temporary_password": "Student@123"
        }
    )

    IDVerificationRecord.objects.filter(student=p1).delete()
    IDVerificationRecord.objects.create(
        student=p1,
        id_card_image="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='320' height='200' fill='%23f8fafc' rx='10' stroke='%230284c7' stroke-width='2'/><text x='20' y='35' font-family='sans-serif' font-weight='bold' font-size='14' fill='%230f172a'>ABC INSTITUTION</text><text x='20' y='55' font-family='sans-serif' font-size='10' fill='%230284c7'>STUDENT SMART ID</text><text x='20' y='90' font-family='sans-serif' font-weight='bold' font-size='12' fill='%230f172a'>Muralidharan K</text><text x='20' y='112' font-family='sans-serif' font-size='11' fill='%23475569'>Roll: STU2026IT001</text><text x='20' y='132' font-family='sans-serif' font-size='11' fill='%23475569'>Information Technology - 3rd Year</text><text x='20' y='178' font-family='monospace' font-weight='bold' font-size='10' fill='%230284c7'>ABC-IT-2026-001</text></svg>",
        extracted_id_number="ABC-IT-2026-001",
        match_score=99.8,
        status="VERIFIED",
        admin_notes="Official institutional biometric and smartcard check passed."
    )

    # 5. Seed Additional Student Roster (STU2026002 to STU2026010)
    extra_students = [
        {"username": "STU2026002", "id": "ABC-CSE-2026-002", "roll": "STU2026CSE002", "name": "Priya Venkatesh", "dept": "Computer Science & Engineering", "year": "3rd Year", "sec": "A", "email": "priya.v@abcinstitution.edu", "phone": "+91 98450 11002"},
        {"username": "STU2026003", "id": "ABC-ECE-2026-003", "roll": "STU2026ECE003", "name": "Vikramaditya Rao", "dept": "Electronics & Communication", "year": "4th Year", "sec": "B", "email": "vikram.r@abcinstitution.edu", "phone": "+91 98450 11003"},
        {"username": "STU2026004", "id": "ABC-IT-2026-004", "roll": "STU2026IT004", "name": "Sneha Raghunathan", "dept": "Information Technology", "year": "3rd Year", "sec": "A", "email": "sneha.r@abcinstitution.edu", "phone": "+91 98450 11004"},
        {"username": "STU2026005", "id": "ABC-MECH-2026-005", "roll": "STU2026MECH005", "name": "Karthik Subramanian", "dept": "Mechanical Engineering", "year": "2nd Year", "sec": "A", "email": "karthik.s@abcinstitution.edu", "phone": "+91 98450 11005"},
        {"username": "STU2026006", "id": "ABC-AIDS-2026-006", "roll": "STU2026AIDS006", "name": "Ananya Mukherjee", "dept": "Artificial Intelligence & Data Science", "year": "3rd Year", "sec": "B", "email": "ananya.m@abcinstitution.edu", "phone": "+91 98450 11006"},
        {"username": "STU2026007", "id": "ABC-CSE-2026-007", "roll": "STU2026CSE007", "name": "Gautam Nair", "dept": "Computer Science & Engineering", "year": "4th Year", "sec": "C", "email": "gautam.n@abcinstitution.edu", "phone": "+91 98450 11007"},
        {"username": "STU2026008", "id": "ABC-IT-2026-008", "roll": "STU2026IT008", "name": "Divya Natarajan", "dept": "Information Technology", "year": "2nd Year", "sec": "A", "email": "divya.n@abcinstitution.edu", "phone": "+91 98450 11008"},
        {"username": "STU2026009", "id": "ABC-MBA-2026-009", "roll": "STU2026MBA009", "name": "Harsh Patel", "dept": "Management Studies", "year": "1st Year", "sec": "A", "email": "harsh.p@abcinstitution.edu", "phone": "+91 98450 11009"},
        {"username": "STU2026010", "id": "ABC-IT-2026-010", "roll": "STU2026IT010", "name": "Meenakshi Sundaram", "dept": "Information Technology", "year": "4th Year", "sec": "A", "email": "meenakshi.s@abcinstitution.edu", "phone": "+91 98450 11010"},
    ]

    all_students = [p1]
    for s in extra_students:
        su, _ = User.objects.get_or_create(username=s["username"], defaults={"email": s["email"]})
        su.set_password("Student@123")
        su.save()

        id_hash = hashlib.sha256(f"{s['id']}:{s['name']}:ABC-INSTITUTION".encode()).hexdigest()
        sp, _ = UserProfile.objects.update_or_create(
            user=su,
            defaults={
                "role": "STUDENT",
                "student_id": s["id"],
                "roll_number": s["roll"],
                "full_name": s["name"],
                "department": s["dept"],
                "year": s["year"],
                "section": s["sec"],
                "phone": s["phone"],
                "id_card_number": s["id"],
                "id_card_hash": id_hash,
                "id_card_qr_ref": f"ABC-VERIFY:{s['id']}:{id_hash[:12]}",
                "eligibility": "ELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED",
                "temporary_password": "Student@123"
            }
        )
        all_students.append(sp)

        IDVerificationRecord.objects.filter(student=sp).delete()
        IDVerificationRecord.objects.create(
            student=sp,
            id_card_image=f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='320' height='200' fill='%23f8fafc' rx='10' stroke='%23cbd5e1' stroke-width='2'/><text x='20' y='35' font-family='sans-serif' font-weight='bold' font-size='14' fill='%230f172a'>ABC INSTITUTION</text><text x='20' y='55' font-family='sans-serif' font-size='10' fill='%230284c7'>STUDENT ID CARD</text><text x='20' y='90' font-family='sans-serif' font-weight='bold' font-size='12' fill='%230f172a'>{s['name']}</text><text x='20' y='112' font-family='sans-serif' font-size='11' fill='%23475569'>Roll: {s['roll']}</text><text x='20' y='132' font-family='sans-serif' font-size='11' fill='%23475569'>{s['dept']} - {s['year']}</text><text x='20' y='178' font-family='monospace' font-weight='bold' font-size='10' fill='%230284c7'>{s['id']}</text></svg>",
            extracted_id_number=s["id"],
            match_score=99.4,
            status="VERIFIED",
            admin_notes="Official institutional smartcard check passed."
        )

        Notification.objects.get_or_create(
            user=sp,
            title="Digital Voting Credential Active",
            defaults={
                "message": f"Hello {s['name']}, your smartcard credentials are verified for all institutional general elections.",
                "notification_type": "WELCOME"
            }
        )
    print(f"[OK] Seeded {len(all_students)} verified student profiles across departments.")

    # 6. Ensure Voter Eligibility for Active Elections
    elections = Election.objects.all()
    for el in elections:
        for st in all_students:
            VoterEligibilityRecord.objects.get_or_create(
                student=st,
                election=el,
                defaults={"has_voted": False}
            )
    print(f"[OK] Linked {len(all_students)} students to {elections.count()} active elections.")

    # 7. Summary
    print("\n--- Final Database Status ---")
    print(f"Total UserProfiles: {UserProfile.objects.count()}")
    print(f"  - Students: {UserProfile.objects.filter(role='STUDENT').count()}")
    print(f"  - EVM Stations: {UserProfile.objects.filter(role='EVM').count()}")
    print(f"  - Admins / CEOs: {UserProfile.objects.filter(role__in=['ADMIN', 'CEO']).count()}")
    print(f"Total ID Verifications: {IDVerificationRecord.objects.count()}")
    print(f"Total Elections: {Election.objects.count()}")
    print(f"Total Candidates: {Candidate.objects.count()}")
    print(f"Total Departments: {Department.objects.count()}")

if __name__ == '__main__':
    populate()
