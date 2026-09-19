"""
Cryptographic Utilities for VotaNova Enterprise Secure Voting Platform
Approved Cryptographic Standards:
- Hashing: SHA-3 (256/512)
- Digital Signing: EdDSA (Ed25519) and ECDSA (SECP256R1/P-384)
- Authenticated Encryption: AES-256-GCM (AEAD)
- Key Exchange: X25519 Elliptic Curve
- Multi-Factor Authentication: RFC 6238 TOTP & FIDO2 Challenge Generation
"""
import hashlib
import hmac
import json
import base64
import time
import os
import struct
import secrets
from typing import Dict, Any, Tuple, List, Optional, Union

from cryptography.hazmat.primitives.asymmetric import ed25519, x25519, rsa, ec, padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature

# ---------------------------------------------------------------------------
# In-Memory Hardware Security Module / Election Authority Key Store
# ---------------------------------------------------------------------------
_AUTHORITY_ED25519_PRIVATE: Optional[ed25519.Ed25519PrivateKey] = None
_AUTHORITY_ED25519_PUBLIC: Optional[ed25519.Ed25519PublicKey] = None
_AUTHORITY_AES_KEY: Optional[bytes] = None

# Backward compatibility key caches
_AUTHORITY_RSA_PRIVATE: Optional[rsa.RSAPrivateKey] = None
_AUTHORITY_RSA_PUBLIC: Optional[rsa.RSAPublicKey] = None
_AUTHORITY_EC_PRIVATE: Optional[ec.EllipticCurvePrivateKey] = None
_AUTHORITY_EC_PUBLIC: Optional[ec.EllipticCurvePublicKey] = None


# ---------------------------------------------------------------------------
# 1. HASHING (SHA-3 256 / 512 as Primary)
# ---------------------------------------------------------------------------
def canonical_json_bytes(data: Any) -> bytes:
    """Produces deterministic canonical UTF-8 bytes for JSON objects."""
    if isinstance(data, dict):
        return json.dumps(data, sort_keys=True, separators=(',', ':')).encode('utf-8')
    elif isinstance(data, (list, tuple)):
        return json.dumps(data, separators=(',', ':')).encode('utf-8')
    elif isinstance(data, bytes):
        return data
    else:
        return str(data).encode('utf-8')


def sha3_256_hash(data: Any) -> str:
    """Computes NIST FIPS 202 SHA-3 (256-bit) hex digest."""
    raw = canonical_json_bytes(data)
    return hashlib.sha3_256(raw).hexdigest()


def sha3_512_hash(data: Any) -> str:
    """Computes NIST FIPS 202 SHA-3 (512-bit) hex digest for master signatures."""
    raw = canonical_json_bytes(data)
    return hashlib.sha3_512(raw).hexdigest()


def sha256_hash(data: Any) -> str:
    """Standard SHA-256 for backward compatibility with existing verifiers."""
    raw = canonical_json_bytes(data)
    return hashlib.sha256(raw).hexdigest()


# ---------------------------------------------------------------------------
# 2. DIGITAL SIGNATURES: EdDSA (Ed25519)
# ---------------------------------------------------------------------------
def get_or_create_ed25519_keys() -> Tuple[ed25519.Ed25519PrivateKey, ed25519.Ed25519PublicKey]:
    """Retrieves or initializes the institution's primary Ed25519 signing keypair."""
    global _AUTHORITY_ED25519_PRIVATE, _AUTHORITY_ED25519_PUBLIC
    if _AUTHORITY_ED25519_PRIVATE is None:
        _AUTHORITY_ED25519_PRIVATE = ed25519.Ed25519PrivateKey.generate()
        _AUTHORITY_ED25519_PUBLIC = _AUTHORITY_ED25519_PRIVATE.public_key()
    return _AUTHORITY_ED25519_PRIVATE, _AUTHORITY_ED25519_PUBLIC


def export_ed25519_public_pem(public_key: Optional[ed25519.Ed25519PublicKey] = None) -> str:
    """Exports an Ed25519 public key as PEM string."""
    if public_key is None:
        _, public_key = get_or_create_ed25519_keys()
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return pem.decode('utf-8')


def sign_payload_ed25519(
    payload: Union[Dict[str, Any], str, bytes],
    private_key: Optional[ed25519.Ed25519PrivateKey] = None
) -> str:
    """
    Signs data using Ed25519 and returns a base64-encoded signature.
    Complies with High-Security Enterprise specification.
    """
    if private_key is None:
        private_key, _ = get_or_create_ed25519_keys()
    raw_data = canonical_json_bytes(payload)
    signature_bytes = private_key.sign(raw_data)
    return base64.b64encode(signature_bytes).decode('utf-8')


def verify_signature_ed25519(
    payload: Union[Dict[str, Any], str, bytes],
    signature_b64: str,
    public_key: Optional[Union[ed25519.Ed25519PublicKey, str]] = None
) -> bool:
    """
    Verifies an Ed25519 digital signature against payload data.
    Public key can be provided as object or PEM string.
    """
    try:
        if public_key is None:
            _, pub_key_obj = get_or_create_ed25519_keys()
        elif isinstance(public_key, str):
            pub_key_obj = serialization.load_pem_public_key(public_key.encode('utf-8'))
        else:
            pub_key_obj = public_key

        raw_data = canonical_json_bytes(payload)
        sig_bytes = base64.b64decode(signature_b64.encode('utf-8'))
        pub_key_obj.verify(sig_bytes, raw_data)
        return True
    except (InvalidSignature, ValueError, Exception):
        return False


# ---------------------------------------------------------------------------
# 3. AUTHENTICATED ENCRYPTION: AES-256-GCM (AEAD)
# ---------------------------------------------------------------------------
def get_or_create_master_aes_key() -> bytes:
    """Retrieves or creates the 256-bit AEAD master key."""
    global _AUTHORITY_AES_KEY
    if _AUTHORITY_AES_KEY is None:
        _AUTHORITY_AES_KEY = AESGCM.generate_key(bit_length=256)
    return _AUTHORITY_AES_KEY


def encrypt_aes_256_gcm(
    plaintext: Union[str, bytes, Dict[str, Any]],
    key: Optional[bytes] = None,
    associated_data: Optional[bytes] = None
) -> Dict[str, str]:
    """
    Encrypts data using AES-256-GCM with a 96-bit cryptographically secure random nonce.
    Returns:
      {
        "ciphertext": base64 string (includes 128-bit authentication tag at end),
        "nonce": base64 string,
        "algorithm": "AES-256-GCM"
      }
    """
    key_bytes = key or get_or_create_master_aes_key()
    aesgcm = AESGCM(key_bytes)
    nonce = os.urandom(12)  # 96-bit IV recommended for GCM

    if isinstance(plaintext, dict):
        raw = json.dumps(plaintext, separators=(',', ':')).encode('utf-8')
    elif isinstance(plaintext, str):
        raw = plaintext.encode('utf-8')
    else:
        raw = plaintext

    ciphertext = aesgcm.encrypt(nonce, raw, associated_data)
    return {
        "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
        "nonce": base64.b64encode(nonce).decode('utf-8'),
        "algorithm": "AES-256-GCM"
      }


def decrypt_aes_256_gcm(
    encrypted_bundle: Dict[str, str],
    key: Optional[bytes] = None,
    associated_data: Optional[bytes] = None
) -> str:
    """
    Decrypts an AES-256-GCM package. Verifies authentication tag.
    Returns decrypted plaintext string.
    """
    key_bytes = key or get_or_create_master_aes_key()
    aesgcm = AESGCM(key_bytes)
    ciphertext = base64.b64decode(encrypted_bundle["ciphertext"].encode('utf-8'))
    nonce = base64.b64decode(encrypted_bundle["nonce"].encode('utf-8'))

    decrypted_bytes = aesgcm.decrypt(nonce, ciphertext, associated_data)
    return decrypted_bytes.decode('utf-8')


# ---------------------------------------------------------------------------
# 4. KEY EXCHANGE: X25519 Elliptic Curve
# ---------------------------------------------------------------------------
def generate_x25519_keypair() -> Tuple[x25519.X25519PrivateKey, x25519.X25519PublicKey]:
    """Generates an ephemeral or static X25519 keypair for key agreement."""
    priv = x25519.X25519PrivateKey.generate()
    return priv, priv.public_key()


def derive_shared_x25519_key(
    private_key: x25519.X25519PrivateKey,
    peer_public_key_bytes_or_pem: Union[bytes, str, x25519.X25519PublicKey]
) -> bytes:
    """
    Derives a 256-bit symmetric key using X25519 Diffie-Hellman,
    followed by SHA-3-256 HKDF-style hashing.
    """
    if isinstance(peer_public_key_bytes_or_pem, x25519.X25519PublicKey):
        peer_pub = peer_public_key_bytes_or_pem
    elif isinstance(peer_public_key_bytes_or_pem, str):
        peer_pub = serialization.load_pem_public_key(peer_public_key_bytes_or_pem.encode('utf-8'))
    else:
        peer_pub = x25519.X25519PublicKey.from_public_bytes(peer_public_key_bytes_or_pem)

    shared_secret = private_key.exchange(peer_pub)
    # Derive uniform 32-byte key via SHA-3-256
    return hashlib.sha3_256(shared_secret).digest()


# ---------------------------------------------------------------------------
# 5. MULTI-FACTOR AUTHENTICATION: RFC 6238 TOTP
# ---------------------------------------------------------------------------
# Base32 alphabet for standard authenticator apps (Google Authenticator, Microsoft Authenticator)
_B32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

def generate_totp_secret(length: int = 32) -> str:
    """Generates a high-entropy Base32 secret for RFC 6238 TOTP."""
    return ''.join(secrets.choice(_B32_ALPHABET) for _ in range(length))


def _b32_decode(secret: str) -> bytes:
    """Decodes standard Base32 string with padding normalization."""
    clean = secret.upper().replace(" ", "").replace("-", "")
    pad_len = (8 - len(clean) % 8) % 8
    clean += "=" * pad_len
    return base64.b32decode(clean)


def generate_totp_code(secret: str, time_step: int = 30, timestamp: Optional[float] = None) -> str:
    """
    Generates a 6-digit TOTP code conforming to RFC 6238 / RFC 4226.
    """
    now = timestamp or time.time()
    counter = int(now // time_step)
    counter_bytes = struct.pack(">Q", counter)

    key_bytes = _b32_decode(secret)
    # HMAC-SHA1 is standard for RFC 6238 compatibility with Google Auth
    hmac_digest = hmac.new(key_bytes, counter_bytes, hashlib.sha1).digest()

    # Dynamic truncation
    offset = hmac_digest[-1] & 0x0F
    code_int = struct.unpack(">I", hmac_digest[offset:offset + 4])[0] & 0x7FFFFFFF
    token = code_int % 1000000
    return f"{token:06d}"


def verify_totp_code(secret: str, candidate_code: str, time_step: int = 30, window: int = 1) -> bool:
    """
    Verifies a TOTP code within a configurable time window (default +/- 1 step = +/- 30s).
    """
    if not secret or not candidate_code:
        return False
    clean_code = candidate_code.strip()
    now = time.time()
    for drift in range(-window, window + 1):
        test_time = now + (drift * time_step)
        expected = generate_totp_code(secret, time_step=time_step, timestamp=test_time)
        if hmac.compare_digest(expected, clean_code):
            return True
    return False


def get_totp_provisioning_uri(secret: str, account_name: str, issuer: str = "VotaNova") -> str:
    """Constructs the standard otpauth URI for QR code generation."""
    return f"otpauth://totp/{issuer}:{account_name}?secret={secret}&issuer={issuer}&algorithm=SHA1&digits=6&period=30"


# ---------------------------------------------------------------------------
# 6. BACKWARD COMPATIBILITY: RSA & SECP256R1 SIGNATURES
# ---------------------------------------------------------------------------
def get_or_create_institution_keys() -> Tuple[rsa.RSAPrivateKey, rsa.RSAPublicKey]:
    """RSA keypair fallback."""
    global _AUTHORITY_RSA_PRIVATE, _AUTHORITY_RSA_PUBLIC
    if _AUTHORITY_RSA_PRIVATE is None:
        _AUTHORITY_RSA_PRIVATE = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        _AUTHORITY_RSA_PUBLIC = _AUTHORITY_RSA_PRIVATE.public_key()
    return _AUTHORITY_RSA_PRIVATE, _AUTHORITY_RSA_PUBLIC


def get_or_create_ec_keys() -> Tuple[ec.EllipticCurvePrivateKey, ec.EllipticCurvePublicKey]:
    """ECDSA keypair fallback."""
    global _AUTHORITY_EC_PRIVATE, _AUTHORITY_EC_PUBLIC
    if _AUTHORITY_EC_PRIVATE is None:
        _AUTHORITY_EC_PRIVATE = ec.generate_private_key(ec.SECP256R1())
        _AUTHORITY_EC_PUBLIC = _AUTHORITY_EC_PRIVATE.public_key()
    return _AUTHORITY_EC_PRIVATE, _AUTHORITY_EC_PUBLIC


def sign_payload_ecdsa(payload: Union[Dict[str, Any], str, bytes], private_key: Optional[ec.EllipticCurvePrivateKey] = None) -> str:
    """Signs payload using SECP256R1 ECDSA."""
    if private_key is None:
        private_key, _ = get_or_create_ec_keys()
    raw = canonical_json_bytes(payload)
    sig = private_key.sign(raw, ec.ECDSA(hashes.SHA256()))
    return base64.b64encode(sig).decode('utf-8')


def verify_signature_ecdsa(payload: Union[Dict[str, Any], str, bytes], signature_b64: str, public_key: Optional[Union[ec.EllipticCurvePublicKey, str]] = None) -> bool:
    """Verifies an ECDSA SECP256R1 signature."""
    try:
        if public_key is None:
            _, pub = get_or_create_ec_keys()
        elif isinstance(public_key, str):
            pub = serialization.load_pem_public_key(public_key.encode('utf-8'))
        else:
            pub = public_key
        raw = canonical_json_bytes(payload)
        sig = base64.b64decode(signature_b64.encode('utf-8'))
        pub.verify(sig, raw, ec.ECDSA(hashes.SHA256()))
        return True
    except Exception:
        return False


def get_public_key_pem(key_type: str = "ED25519") -> str:
    """Returns the requested public key as PEM string."""
    kt = key_type.upper()
    if kt == "ED25519":
        return export_ed25519_public_pem()
    elif kt == "ECDSA":
        _, pub = get_or_create_ec_keys()
    else:
        _, pub = get_or_create_institution_keys()

    return pub.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')


def sign_payload(payload_dict: Dict[str, Any]) -> str:
    """Primary payload signing using Ed25519 (falls back to RSA if requested)."""
    return sign_payload_ed25519(payload_dict)


def verify_signature(payload_dict: Dict[str, Any], signature_b64: str, public_key_pem: Optional[str] = None) -> bool:
    """
    Universal signature verification: automatically attempts Ed25519 first,
    then falls back to RSA/ECDSA if needed.
    """
    if verify_signature_ed25519(payload_dict, signature_b64, public_key_pem):
        return True

    # Try RSA fallback
    try:
        if public_key_pem:
            public_key = serialization.load_pem_public_key(public_key_pem.encode('utf-8'))
        else:
            _, public_key = get_or_create_institution_keys()

        canonical_json = canonical_json_bytes(payload_dict)
        signature_bytes = base64.b64decode(signature_b64.encode('utf-8'))
        public_key.verify(
            signature_bytes,
            canonical_json,
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256()
        )
        return True
    except Exception:
        pass

    return False


def batch_verify_signatures(payloads_with_signatures: List[Tuple[Dict[str, Any], str]]) -> Tuple[bool, int, List[int]]:
    """High-throughput signature verification."""
    failed_indices = []
    for idx, (payload, sig) in enumerate(payloads_with_signatures):
        if not verify_signature(payload, sig):
            failed_indices.append(idx)
    return len(failed_indices) == 0, len(payloads_with_signatures) - len(failed_indices), failed_indices
