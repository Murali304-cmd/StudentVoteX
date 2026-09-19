# StudentVoiceX (ABC Institution)
> **"Your Voice Builds Tomorrow."**

StudentVoiceX is a production-style, educational permissioned blockchain-powered college election management platform built specifically for **ABC Institution**.

---

## 🏛️ System Architecture

### 1. Three Dedicated Roles
1. **STUDENT** (`/student/*`): Single common login, digital student ID card, smart verification, distraction-free ballot casting with candidate comparison tool, anonymous cryptographic voting tokens.
2. **EVM** (`/evm/*`): Dedicated physical kiosk terminal operations, live session monitoring, voter eligibility lookup, and tamper-evident blockchain verification.
3. **ADMIN** (`/admin/*`): Complete institution management suite, automated student registration with ID card hashing, EVM terminal provisioning, election management with multi-position candidates, and SHA-256 Merkle Tree blockchain audit explorer.

### 2. Privacy & Cryptography Architecture
- **Zero Identity Linkage**: Ballots are never recorded directly alongside student identities.
- **Anonymous Voting Tokens**: Students are issued ephemeral cryptographic tokens upon eligibility verification.
- **Permissioned Blockchain**: Python-based permissioned ledger with SHA-256 hashing, Merkle Tree proofs, Proof-of-Work/Proof-of-Authority hybrid consensus, and tamper detection.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Backend Setup (Django + DRF + Blockchain)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 127.0.0.1:8000
```

### Frontend Setup (React + Vite + Framer Motion)
```bash
cd frontend
npm install
npm run dev
```

Visit the application at: `http://localhost:5173/`

---

## 🔑 Demo Login Credentials

| Role | User ID | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Student Voter** | `STU2026001` | `Student@123` | `/student/dashboard` |
| **EVM Kiosk Station** | `evm_kiosk_01` | `EVM@ABC2026` | `/evm/dashboard` |
| **System Admin** | `admin` | `Admin@ABC2026` | `/admin/dashboard` |

---

## 🌐 ₹0 Free College Demonstration Deployment

### Frontend (Cloudflare Pages)
1. Push `frontend/` to GitHub.
2. Connect to Cloudflare Pages.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend.pythonanywhere.com/api`

### Backend (PythonAnywhere Free Tier)
1. Upload `backend/` to PythonAnywhere.
2. Configure Virtualenv and WSGI configuration file to point to `votechain_server.wsgi`.
3. Run `python manage.py migrate` and `python manage.py seed_demo`.

---

## 📄 License
Educational Institutional License - ABC Institution.
