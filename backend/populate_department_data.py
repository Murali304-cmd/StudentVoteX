import os
import django
import hashlib

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'votechain_server.settings')
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from votechain_backend.models import (
    Department, UserProfile, Election, Candidate, VoterEligibilityRecord,
    IDVerificationRecord, Notification
)

def setup_departments_and_students():
    print("=== ENRICHING DEPARTMENTS, REPRESENTATIVES & ROSTER DATA ===")

    # 1. Departments Configuration
    dept_configs = [
        {
            "code": "IT",
            "name": "Information Technology",
            "roll_prefix": "7678BIT",
            "student_id_prefix": "7678BIT",
            "rep_name": "Muralidharan K",
            "rep_roll": "7678BIT001",
            "email": "hod.it@muralidharan.edu"
        },
        {
            "code": "CSE",
            "name": "Computer Science & Engineering",
            "roll_prefix": "7678BCS",
            "student_id_prefix": "7678BCS",
            "rep_name": "Priya Venkatesh",
            "rep_roll": "7678BCS001",
            "email": "hod.cse@muralidharan.edu"
        },
        {
            "code": "ECE",
            "name": "Electronics & Communication",
            "roll_prefix": "7678BEC",
            "student_id_prefix": "7678BEC",
            "rep_name": "Vikramaditya Rao",
            "rep_roll": "7678BEC001",
            "email": "hod.ece@muralidharan.edu"
        },
        {
            "code": "MECH",
            "name": "Mechanical Engineering",
            "roll_prefix": "7678BME",
            "student_id_prefix": "7678BME",
            "rep_name": "Karthik Subramanian",
            "rep_roll": "7678BME001",
            "email": "hod.mech@muralidharan.edu"
        },
        {
            "code": "AIDS",
            "name": "Artificial Intelligence & Data Science",
            "roll_prefix": "7678BAD",
            "student_id_prefix": "7678BAD",
            "rep_name": "Ananya Mukherjee",
            "rep_roll": "7678BAD001",
            "email": "hod.aids@muralidharan.edu"
        },
        {
            "code": "EEE",
            "name": "Electrical & Electronics Engineering",
            "roll_prefix": "7678BEE",
            "student_id_prefix": "7678BEE",
            "rep_name": "Rajesh Kannan",
            "rep_roll": "7678BEE001",
            "email": "hod.eee@muralidharan.edu"
        },
        {
            "code": "CIVIL",
            "name": "Civil Engineering",
            "roll_prefix": "7678BCE",
            "student_id_prefix": "7678BCE",
            "rep_name": "Deepan Chakravarthy",
            "rep_roll": "7678BCE001",
            "email": "hod.civil@muralidharan.edu"
        }
    ]

    dept_map = {}
    for cfg in dept_configs:
        dept, _ = Department.objects.update_or_create(
            code=cfg["code"],
            defaults={
                "name": cfg["name"],
                "roll_prefix": cfg["roll_prefix"],
                "student_id_prefix": cfg["student_id_prefix"],
                "representative_name": cfg["rep_name"],
                "representative_roll": cfg["rep_roll"],
                "contact_email": cfg["email"]
            }
        )
        dept_map[cfg["code"]] = dept
        print(f"[OK] Department registered: {dept.name} ({cfg['roll_prefix']}001+)")

    # 2. Comprehensive Student Roster with Separate Classes & Sections
    students_data = [
        # Information Technology (7678BIT)
        {"roll": "7678BIT001", "name": "Muralidharan K", "dept": "Information Technology", "year": "3rd Year", "sec": "A", "cgpa": 8.9, "att": 92, "is_rep": True, "rep_title": "IT Department Representative", "phone": "+91 7639170303", "email": "muralidharanprathap@gmail.com"},
        {"roll": "7678BIT002", "name": "Sneha Raghunathan", "dept": "Information Technology", "year": "3rd Year", "sec": "A", "cgpa": 8.7, "att": 88, "is_rep": False, "rep_title": "IT DR Candidate Nominee", "phone": "+91 98450 11004", "email": "sneha.r@muralidharan.edu"},
        {"roll": "7678BIT003", "name": "Divya Natarajan", "dept": "Information Technology", "year": "2nd Year", "sec": "A", "cgpa": 8.4, "att": 85, "is_rep": True, "rep_title": "Class Representative (Year 2 - Sec A)", "phone": "+91 98450 11008", "email": "divya.n@muralidharan.edu"},
        {"roll": "7678BIT004", "name": "Meenakshi Sundaram", "dept": "Information Technology", "year": "4th Year", "sec": "B", "cgpa": 9.1, "att": 95, "is_rep": False, "rep_title": "", "phone": "+91 98450 11010", "email": "meenakshi.s@muralidharan.edu"},
        {"roll": "7678BIT005", "name": "Ashwin Kumar", "dept": "Information Technology", "year": "1st Year", "sec": "A", "cgpa": 8.2, "att": 80, "is_rep": True, "rep_title": "Class Representative (Year 1 - Sec A)", "phone": "+91 98450 11011", "email": "ashwin.k@muralidharan.edu"},
        {"roll": "7678BIT006", "name": "Praveen Raj", "dept": "Information Technology", "year": "2nd Year", "sec": "B", "cgpa": 7.9, "att": 82, "is_rep": False, "rep_title": "", "phone": "+91 98450 11012", "email": "praveen.r@muralidharan.edu"},
        {"roll": "7678BIT007", "name": "Kavitha Ramesh", "dept": "Information Technology", "year": "3rd Year", "sec": "B", "cgpa": 8.5, "att": 89, "is_rep": True, "rep_title": "Class Representative (Year 3 - Sec B)", "phone": "+91 98450 11013", "email": "kavitha.r@muralidharan.edu"},
        {"roll": "7678BIT008", "name": "Sanjay Balaji", "dept": "Information Technology", "year": "4th Year", "sec": "A", "cgpa": 8.6, "att": 86, "is_rep": False, "rep_title": "", "phone": "+91 98450 11014", "email": "sanjay.b@muralidharan.edu"},

        # Computer Science & Engineering (7678BCS)
        {"roll": "7678BCS001", "name": "Priya Venkatesh", "dept": "Computer Science & Engineering", "year": "3rd Year", "sec": "A", "cgpa": 9.3, "att": 96, "is_rep": True, "rep_title": "CSE Department Representative", "phone": "+91 98450 11002", "email": "priya.v@muralidharan.edu"},
        {"roll": "7678BCS002", "name": "Gautam Nair", "dept": "Computer Science & Engineering", "year": "4th Year", "sec": "C", "cgpa": 8.8, "att": 90, "is_rep": False, "rep_title": "CSE DR Candidate Nominee", "phone": "+91 98450 11007", "email": "gautam.n@muralidharan.edu"},
        {"roll": "7678BCS003", "name": "Rohit Varma", "dept": "Computer Science & Engineering", "year": "2nd Year", "sec": "A", "cgpa": 8.5, "att": 84, "is_rep": True, "rep_title": "Class Representative (Year 2 - Sec A)", "phone": "+91 98450 11015", "email": "rohit.v@muralidharan.edu"},
        {"roll": "7678BCS004", "name": "Ananya Sharma", "dept": "Computer Science & Engineering", "year": "3rd Year", "sec": "B", "cgpa": 9.0, "att": 92, "is_rep": False, "rep_title": "", "phone": "+91 98450 11016", "email": "ananya.s@muralidharan.edu"},
        {"roll": "7678BCS005", "name": "Deepak Raj", "dept": "Computer Science & Engineering", "year": "1st Year", "sec": "B", "cgpa": 8.1, "att": 83, "is_rep": False, "rep_title": "", "phone": "+91 98450 11017", "email": "deepak.r@muralidharan.edu"},

        # Electronics & Communication (7678BEC)
        {"roll": "7678BEC001", "name": "Vikramaditya Rao", "dept": "Electronics & Communication", "year": "4th Year", "sec": "B", "cgpa": 8.9, "att": 91, "is_rep": True, "rep_title": "ECE Department Representative", "phone": "+91 98450 11003", "email": "vikram.r@muralidharan.edu"},
        {"roll": "7678BEC002", "name": "Keerthi Suresh", "dept": "Electronics & Communication", "year": "3rd Year", "sec": "A", "cgpa": 8.6, "att": 87, "is_rep": False, "rep_title": "ECE DR Candidate Nominee", "phone": "+91 98450 11018", "email": "keerthi.s@muralidharan.edu"},
        {"roll": "7678BEC003", "name": "Manoj Kumar", "dept": "Electronics & Communication", "year": "2nd Year", "sec": "A", "cgpa": 8.3, "att": 82, "is_rep": True, "rep_title": "Class Representative (Year 2 - Sec A)", "phone": "+91 98450 11019", "email": "manoj.k@muralidharan.edu"},

        # Mechanical Engineering (7678BME)
        {"roll": "7678BME001", "name": "Karthik Subramanian", "dept": "Mechanical Engineering", "year": "2nd Year", "sec": "A", "cgpa": 8.5, "att": 85, "is_rep": True, "rep_title": "MECH Department Representative", "phone": "+91 98450 11005", "email": "karthik.s@muralidharan.edu"},
        {"roll": "7678BME002", "name": "Vigneshwaran S", "dept": "Mechanical Engineering", "year": "3rd Year", "sec": "B", "cgpa": 8.2, "att": 84, "is_rep": False, "rep_title": "MECH DR Candidate Nominee", "phone": "+91 98450 11020", "email": "vignesh.s@muralidharan.edu"},

        # Artificial Intelligence & Data Science (7678BAD)
        {"roll": "7678BAD001", "name": "Ananya Mukherjee", "dept": "Artificial Intelligence & Data Science", "year": "3rd Year", "sec": "B", "cgpa": 9.4, "att": 94, "is_rep": True, "rep_title": "AIDS Department Representative", "phone": "+91 98450 11006", "email": "ananya.m@muralidharan.edu"},
        {"roll": "7678BAD002", "name": "Siddarth Reddy", "dept": "Artificial Intelligence & Data Science", "year": "2nd Year", "sec": "A", "cgpa": 8.7, "att": 88, "is_rep": False, "rep_title": "AIDS DR Candidate Nominee", "phone": "+91 98450 11021", "email": "siddarth.r@muralidharan.edu"},

        # Electrical & Electronics Engineering (7678BEE)
        {"roll": "7678BEE001", "name": "Rajesh Kannan", "dept": "Electrical & Electronics Engineering", "year": "3rd Year", "sec": "A", "cgpa": 8.8, "att": 90, "is_rep": True, "rep_title": "EEE Department Representative", "phone": "+91 98450 11022", "email": "rajesh.k@muralidharan.edu"},
        {"roll": "7678BEE002", "name": "Shalini Mohan", "dept": "Electrical & Electronics Engineering", "year": "4th Year", "sec": "A", "cgpa": 8.6, "att": 86, "is_rep": False, "rep_title": "", "phone": "+91 98450 11023", "email": "shalini.m@muralidharan.edu"},

        # Civil Engineering (7678BCE)
        {"roll": "7678BCE001", "name": "Deepan Chakravarthy", "dept": "Civil Engineering", "year": "3rd Year", "sec": "A", "cgpa": 8.4, "att": 85, "is_rep": True, "rep_title": "CIVIL Department Representative", "phone": "+91 98450 11024", "email": "deepan.c@muralidharan.edu"}
    ]

    all_student_profiles = []

    for s in students_data:
        # Create user with both roll as username and standard password
        user, _ = User.objects.get_or_create(
            username=s["roll"],
            defaults={"email": s["email"], "first_name": s["name"].split()[0]}
        )
        user.set_password("Student@123")
        user.email = s["email"]
        user.save()

        # Also support alias username 'STU2026001' for Muralidharan K
        if s["roll"] == "7678BIT001":
            alias_user, _ = User.objects.get_or_create(
                username="STU2026001",
                defaults={"email": s["email"], "first_name": "Muralidharan"}
            )
            alias_user.set_password("Student@123")
            alias_user.save()

        id_hash = hashlib.sha256(f"{s['roll']}:{s['name']}:MURALIDHARAN-COLLEGE".encode()).hexdigest()
        qr_ref = f"MCT-VERIFY:{s['roll']}:{id_hash[:16]}"

        profile, _ = UserProfile.objects.update_or_create(
            user=user,
            defaults={
                "role": "STUDENT",
                "student_id": s["roll"],
                "roll_number": s["roll"],
                "full_name": s["name"],
                "department": s["dept"],
                "year": s["year"],
                "section": s["sec"],
                "phone": s["phone"],
                "cgpa": s["cgpa"],
                "attendance": s["att"],
                "disciplinary_clearance": True,
                "is_representative": s["is_rep"],
                "representative_title": s["rep_title"],
                "id_card_number": s["roll"],
                "id_card_hash": id_hash,
                "id_card_qr_ref": qr_ref,
                "eligibility": "ELIGIBLE",
                "status": "ACTIVE",
                "verification_status": "VERIFIED",
                "temporary_password": "Student@123"
            }
        )
        all_student_profiles.append(profile)

        # Ensure ID Verification Record
        IDVerificationRecord.objects.update_or_create(
            student=profile,
            defaults={
                "extracted_id_number": s["roll"],
                "match_score": 99.8,
                "status": "VERIFIED",
                "admin_notes": f"Biometrically enrolled & authorized for {s['dept']} elections."
            }
        )

        # Welcome notification
        Notification.objects.get_or_create(
            user=profile,
            title=f"Welcome to {s['dept']} Department Portal",
            defaults={
                "message": f"Hello {s['name']} ({s['roll']}), you are assigned to {s['year']} - Section {s['sec']}. Your official digital voting credentials are valid.",
                "notification_type": "WELCOME"
            }
        )

    print(f"[OK] Seeded {len(all_student_profiles)} student profiles with format (7678BIT001, 7678BCS001, etc.)")

    # 3. Create Specific Department Representative Elections
    now = timezone.now()
    start_dt = now.replace(hour=8, minute=0, second=0, microsecond=0)
    end_dt = start_dt + timezone.timedelta(days=7)

    # General Campus President Election
    pres_el, _ = Election.objects.update_or_create(
        title="Muralidharan College - Student Council President Election 2026",
        defaults={
            "description": "General institutional election open to all students across all engineering and technology departments.",
            "academic_year": "2026",
            "department": "ALL",
            "eligible_departments": "ALL",
            "eligible_years": "ALL",
            "start_date": start_dt,
            "end_date": end_dt,
            "daily_start_time": "08:00",
            "daily_end_time": "20:00",
            "voting_hours_enforced": False,
            "status": "ACTIVE",
            "camera_required": True,
            "id_verification_required": True
        }
    )

    # President candidates
    Candidate.objects.update_or_create(
        candidate_id="CAND-PRES-01",
        election=pres_el,
        defaults={
            "name": "Muralidharan K",
            "position": "Student Council President",
            "department": "Information Technology",
            "year": "3rd Year",
            "section": "A",
            "election_symbol": "🚀",
            "symbol_name": "Rocket",
            "biography": "3rd Year IT student, Blockchain lead, advocate of transparent student representation.",
            "manifesto": "• 24x7 Innovation Labs & Maker Space\n• Transparent Student Welfare Fund Allocation\n• Campus-wide High-Speed Wi-Fi Upgrades\n• Annual National Hackathon Sponsorship",
            "status": "APPROVED",
            "vote_count": 84
        }
    )
    Candidate.objects.update_or_create(
        candidate_id="CAND-PRES-02",
        election=pres_el,
        defaults={
            "name": "Priya Venkatesh",
            "position": "Student Council President",
            "department": "Computer Science & Engineering",
            "year": "3rd Year",
            "section": "A",
            "election_symbol": "★",
            "symbol_name": "Star",
            "biography": "CSE topper, ACM student chair, focused on academic excellence & international research forums.",
            "manifesto": "• Research Fellowships & Industry Tie-ups\n• Modern Hostel Facilities & Cafeteria Hygiene\n• Mental Health & Student Mentorship Programs\n• Green Campus & Solar Powered Common Areas",
            "status": "APPROVED",
            "vote_count": 79
        }
    )

    # Department Representative Elections for each department
    dr_elections = [
        {
            "dept_code": "IT",
            "dept_name": "Information Technology",
            "title": "Information Technology - Department Representative (DR) Election 2026",
            "desc": "Official democratic election to elect the Department Representative (DR) for Information Technology.",
            "candidates": [
                {"cid": "DR-IT-01", "name": "Muralidharan K", "roll": "7678BIT001", "symbol": "⚡", "sym_name": "Lightning Bolt", "manifesto": "• IT Project Sponsorship & Cloud Server Credits\n• Fast Track Tech Placements & Alumni Mentoring\n• Lab Equipment Refresh & Dual Monitor Setup"},
                {"cid": "DR-IT-02", "name": "Sneha Raghunathan", "roll": "7678BIT002", "symbol": "🛡️", "sym_name": "Shield", "manifesto": "• Open Source Contribution Bootcamps\n• Peer-to-Peer Coding Clinics & Exam Preparation\n• Inclusive Tech Leadership Seminars"}
            ]
        },
        {
            "dept_code": "CSE",
            "dept_name": "Computer Science & Engineering",
            "title": "Computer Science & Engineering - Department Representative (DR) Election 2026",
            "desc": "Official democratic election to elect the Department Representative (DR) for Computer Science & Engineering.",
            "candidates": [
                {"cid": "DR-CSE-01", "name": "Priya Venkatesh", "roll": "7678BCS001", "symbol": "💎", "sym_name": "Diamond", "manifesto": "• GPU Cluster Access for AI/ML Students\n• ICPC & Competitive Programming Coaching\n• Department Tech Symposium Expansion"},
                {"cid": "DR-CSE-02", "name": "Gautam Nair", "roll": "7678BCS002", "symbol": "🔥", "sym_name": "Flame", "manifesto": "• Linux Kernel Workshops & Systems Programming\n• Student Start-up Incubation Grants\n• 24/7 Department Hack Lounge"}
            ]
        },
        {
            "dept_code": "ECE",
            "dept_name": "Electronics & Communication",
            "title": "Electronics & Communication - Department Representative (DR) Election 2026",
            "desc": "Official democratic election to elect the Department Representative (DR) for Electronics & Communication.",
            "candidates": [
                {"cid": "DR-ECE-01", "name": "Vikramaditya Rao", "roll": "7678BEC001", "symbol": "📡", "sym_name": "Satellite", "manifesto": "• VLSI Design & Embedded Systems Toolchains\n• Robotics Club Modernization & Autonomous Drones\n• Core Electronics Industry Internships"},
                {"cid": "DR-ECE-02", "name": "Keerthi Suresh", "roll": "7678BEC002", "symbol": "💡", "sym_name": "Bulb", "manifesto": "• IoT Smart Campus Initiatives\n• Signal Processing & Telecom Labs Enhancement\n• Women in STEM Scholarships"}
            ]
        },
        {
            "dept_code": "MECH",
            "dept_name": "Mechanical Engineering",
            "title": "Mechanical Engineering - Department Representative (DR) Election 2026",
            "desc": "Official democratic election to elect the Department Representative (DR) for Mechanical Engineering.",
            "candidates": [
                {"cid": "DR-MECH-01", "name": "Karthik Subramanian", "roll": "7678BME001", "symbol": "⚙️", "sym_name": "Gear", "manifesto": "• SAE BAJA & Formula Student Team Sponsorship\n• Advanced CAD/CAM & 3D Printing Facility\n• Industrial Safety Equipment & Automation Kits"},
                {"cid": "DR-MECH-02", "name": "Vigneshwaran S", "roll": "7678BME002", "symbol": "🛠️", "sym_name": "Tools", "manifesto": "• EV Powertrain & Battery Tech Labs\n• Thermal Engineering Research Facility\n• Heavy Industry Apprenticeships"}
            ]
        },
        {
            "dept_code": "AIDS",
            "dept_name": "Artificial Intelligence & Data Science",
            "title": "Artificial Intelligence & Data Science - Department Representative (DR) Election 2026",
            "desc": "Official democratic election to elect the Department Representative (DR) for AI & Data Science.",
            "candidates": [
                {"cid": "DR-AIDS-01", "name": "Ananya Mukherjee", "roll": "7678BAD001", "symbol": "🧠", "sym_name": "Brain Neural", "manifesto": "• High Performance Deep Learning Compute Server\n• Kaggle Grandmaster Mentorship Series\n• Generative AI & Data Ethics Symposia"},
                {"cid": "DR-AIDS-02", "name": "Siddarth Reddy", "roll": "7678BAD002", "symbol": "🌐", "sym_name": "Global Net", "manifesto": "• Computer Vision & Autonomous Systems Kits\n• Big Data Engineering Certification Vouchers\n• Healthcare AI Research Partnerships"}
            ]
        }
    ]

    all_elections = [pres_el]

    for dr in dr_elections:
        el, _ = Election.objects.update_or_create(
            title=dr["title"],
            defaults={
                "description": dr["desc"],
                "academic_year": "2026",
                "department": dr["dept_name"],
                "eligible_departments": dr["dept_name"],
                "eligible_years": "ALL",
                "start_date": start_dt,
                "end_date": end_dt,
                "daily_start_time": "08:00",
                "daily_end_time": "20:00",
                "voting_hours_enforced": False,
                "status": "ACTIVE",
                "camera_required": True,
                "id_verification_required": True
            }
        )
        all_elections.append(el)

        for c in dr["candidates"]:
            Candidate.objects.update_or_create(
                candidate_id=c["cid"],
                election=el,
                defaults={
                    "name": c["name"],
                    "position": f"Department Representative ({dr['dept_code']})",
                    "department": dr["dept_name"],
                    "year": "3rd Year",
                    "section": "A",
                    "election_symbol": c["symbol"],
                    "symbol_name": c["sym_name"],
                    "biography": f"Dedicated candidate running for {dr['dept_name']} Department Representative.",
                    "manifesto": c["manifesto"],
                    "status": "APPROVED",
                    "vote_count": 42
                }
            )
        print(f"[OK] Configured Department Election: {el.title}")

    # 4. Link All Students to Eligible Elections
    for prof in all_student_profiles:
        for el in all_elections:
            # Check department match
            if el.department == 'ALL' or el.department.lower() == prof.department.lower():
                VoterEligibilityRecord.objects.get_or_create(
                    student=prof,
                    election=el,
                    defaults={"has_voted": False}
                )

    print(f"\n[SUCCESS] Configured {len(dept_configs)} Departments, {len(all_student_profiles)} Students with '7678B...' roll numbers, and {len(all_elections)} Elections (Campus-wide + Department Representatives)!")

if __name__ == '__main__':
    setup_departments_and_students()
