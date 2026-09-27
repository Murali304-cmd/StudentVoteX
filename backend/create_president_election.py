import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'votechain_server.settings')
django.setup()

from django.utils import timezone
from votechain_backend.models import Election, Candidate, VoterEligibilityRecord, EncryptedVoteRecord, AnonymousVotingToken

def setup_president_election():
    # 1. Fetch or create Election 1 as the Student Council President Election 2026
    election, created = Election.objects.get_or_create(
        id=1,
        defaults={
            "title": "ABC Institution - Student Council President Election 2026",
            "description": "Official Institutional Election for Student Council President 2026. 6 presidential nominees contesting for the apex student leadership office.",
            "academic_year": "2026",
            "department": "ALL",
            "eligible_departments": "ALL",
            "eligible_years": "ALL",
            "start_date": timezone.now() - timezone.timedelta(hours=2),
            "end_date": timezone.now() + timezone.timedelta(days=7),
            "daily_start_time": "09:00",
            "daily_end_time": "12:00",
            "voting_hours_enforced": True,
            "status": "ACTIVE",
            "camera_required": True,
            "id_verification_required": True,
            "rules": "1. Mandatory biometric face verification.\n2. Strict 60-second voting session.\n3. Anti-screenshot protected kiosk.\n4. One verified vote per eligible student."
        }
    )

    if not created:
        election.title = "ABC Institution - Student Council President Election 2026"
        election.description = "Official Institutional Election for Student Council President 2026. 6 presidential nominees contesting for the apex student leadership office."
        election.academic_year = "2026"
        election.department = "ALL"
        election.eligible_departments = "ALL"
        election.eligible_years = "ALL"
        election.status = "ACTIVE"
        election.daily_start_time = "09:00"
        election.daily_end_time = "12:00"
        election.voting_hours_enforced = True
        election.start_date = timezone.now() - timezone.timedelta(hours=2)
        election.end_date = timezone.now() + timezone.timedelta(days=7)
        election.save()

    print(f"[OK] Election configured: {election.title} (ID: {election.id})")

    # 2. Configure the 6 Presidential Candidates
    candidates_data = [
        {
            "candidate_id": "CAN-PRES-01",
            "name": "Arun Kumar",
            "position": "President",
            "department": "Computer Science & Engineering",
            "year": "IV",
            "section": "A",
            "election_symbol": "★",
            "symbol_name": "Star",
            "biography": "Dedicated to student innovation, AI labs, and high-speed campus tech incubators.",
            "manifesto": "Transforming campus infrastructure with 24/7 tech incubators, smart labs, and tier-1 corporate placement partnerships.",
            "priorities": "• 24/7 Tech Incubators\n• Tier-1 Placement Training\n• Campus High-Speed Wi-Fi\n• Research Grants & Hackathons",
            "status": "APPROVED",
            "vote_count": 0
        },
        {
            "candidate_id": "CAN-PRES-02",
            "name": "Devika Raman",
            "position": "President",
            "department": "Information Technology",
            "year": "IV",
            "section": "B",
            "election_symbol": "⚡",
            "symbol_name": "Lightning Bolt",
            "biography": "Student welfare champion focusing on transparent council budgeting and campus-wide inclusivity.",
            "manifesto": "Championing student welfare, transparent fund allocations, national hackathons, and holistic campus well-being.",
            "priorities": "• Transparent Student Council Fund\n• Mental Wellness & Health Wing\n• Inter-College Hackathon Sponsorship\n• Eco-Campus Green Initiative",
            "status": "APPROVED",
            "vote_count": 0
        },
        {
            "candidate_id": "CAN-PRES-03",
            "name": "Siddharth Verma",
            "position": "President",
            "department": "Electronics & Communication Engineering",
            "year": "IV",
            "section": "A",
            "election_symbol": "🏛️",
            "symbol_name": "Crest Dome",
            "biography": "Hardware innovator passionate about robotics, drone research, and deep-tech industry internships.",
            "manifesto": "Bridging academia with core industries, launching state-of-the-art robotics labs, and hosting national technical expos.",
            "priorities": "• Core Hardware Industry Alliances\n• Robotics & IoT Maker Labs\n• National Technical Symposiums\n• Hostel Living Infrastructure",
            "status": "APPROVED",
            "vote_count": 0
        },
        {
            "candidate_id": "CAN-PRES-04",
            "name": "Meera Krishnan",
            "position": "President",
            "department": "Mechanical Engineering",
            "year": "IV",
            "section": "C",
            "election_symbol": "⚙️",
            "symbol_name": "Gear Wheel",
            "biography": "Formula student captain and athletic leader committed to collegiate sports and hands-on fabrication.",
            "manifesto": "Revitalizing collegiate sports culture, modernizing cafeteria nutrition standards, and establishing student makerspaces.",
            "priorities": "• Sports Complex & Turf Upgrade\n• Cafeteria Food Quality Audit\n• Design & 3D Fabrication Labs\n• Campus Night Transport Fleet",
            "status": "APPROVED",
            "vote_count": 0
        },
        {
            "candidate_id": "CAN-PRES-05",
            "name": "Rohan Deshmukh",
            "position": "President",
            "department": "Electrical & Electronics Engineering",
            "year": "IV",
            "section": "A",
            "election_symbol": "📖",
            "symbol_name": "Open Book",
            "biography": "Academic mentor and researcher committed to student grievance redressal and digital library modernization.",
            "manifesto": "Democratizing digital academic resources, establishing peer mentoring circles, and zero-delay grievance resolution.",
            "priorities": "• 24/7 Digital Library & Journal Access\n• Student Grievance Fast-Track Cell\n• Merit & Need-Based Scholarships\n• Free Professional Certifications",
            "status": "APPROVED",
            "vote_count": 0
        },
        {
            "candidate_id": "CAN-PRES-06",
            "name": "Ananya Sharma",
            "position": "President",
            "department": "Biotechnology & Chemical Engineering",
            "year": "IV",
            "section": "B",
            "election_symbol": "🚀",
            "symbol_name": "Rocket",
            "biography": "Biotech researcher and entrepreneurship lead driving sustainable green campus innovations and student startups.",
            "manifesto": "Catalyzing interdisciplinary startup seed funds, eco-friendly solar initiatives, and international exchange symposiums.",
            "priorities": "• Student Startup Incubation Seed Fund\n• Cultural Fest Modernization\n• Global Alumni Mentorship Network\n• Solar & Zero-Waste Campus Drive",
            "status": "APPROVED",
            "vote_count": 0
        }
    ]

    # Clean old candidates for election 1 and insert all 6
    Candidate.objects.filter(election=election).delete()

    created_candidates = []
    for cand in candidates_data:
        c = Candidate.objects.create(
            election=election,
            candidate_id=cand["candidate_id"],
            name=cand["name"],
            position=cand["position"],
            department=cand["department"],
            year=cand["year"],
            section=cand["section"],
            election_symbol=cand["election_symbol"],
            symbol_name=cand["symbol_name"],
            biography=cand["biography"],
            manifesto=cand["manifesto"],
            priorities=cand["priorities"],
            status=cand["status"],
            vote_count=0
        )
        created_candidates.append(c)

    print(f"[OK] Successfully created {len(created_candidates)} President election members:")
    for idx, c in enumerate(created_candidates, 1):
        print(f"  {idx}. {c.name} ({c.position}) | Dept: {c.department} | Symbol: {c.symbol_name} | ID: {c.candidate_id}")

    # 3. Reset demo student eligibility so testing can vote cleanly
    VoterEligibilityRecord.objects.filter(election=election).update(has_voted=False, voted_at=None, voting_session_token=None)
    AnonymousVotingToken.objects.filter(election=election).delete()
    print("[OK] Reset voter eligibility for testing demo students.")

if __name__ == '__main__':
    setup_president_election()
