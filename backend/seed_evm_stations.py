import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'votechain_server.settings')
django.setup()

from django.contrib.auth.models import User
from votechain_backend.models import UserProfile

stations_data = [
    {
        'username': 'evm_kiosk_01',
        'full_name': 'EVM Station #01 (Main Campus Auditorium)',
        'department': 'Auditorium Polling Enclave (Ground Floor)',
        'section': 'Booth-01',
        'pin': 'EVM@ABC2026',
        'status': 'ONLINE'
    },
    {
        'username': 'evm_kiosk_02',
        'full_name': 'EVM Station #02 (Central Library West Wing)',
        'department': 'Library Polling Enclave (West Wing)',
        'section': 'Booth-02',
        'pin': 'EVM@ABC2026',
        'status': 'ONLINE'
    }
]

for s in stations_data:
    user, u_created = User.objects.get_or_create(username=s['username'], defaults={
        'email': f"{s['username']}@abcinstitution.edu",
        'first_name': s['full_name'].split()[0],
        'last_name': 'Station'
    })
    user.set_password(s['pin'])
    user.save()

    prof, p_created = UserProfile.objects.get_or_create(user=user, defaults={
        'role': 'EVM',
        'student_id': s['username'],
        'roll_number': s['username'],
        'full_name': s['full_name'],
        'department': s['department'],
        'year': 'Terminal',
        'section': s['section'],
        'phone': '+91 98765 00000',
        'eligibility': 'INELIGIBLE',
        'status': s['status'],
        'verification_status': 'VERIFIED',
        'temporary_password': s['pin']
    })
    if not p_created:
        prof.role = 'EVM'
        prof.full_name = s['full_name']
        prof.department = s['department']
        prof.section = s['section']
        prof.status = s['status']
        prof.save()
    print(f"EVM Station synced: {s['username']}, Profile PK: {prof.pk}, Created: {p_created}")
