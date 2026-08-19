"""
app/shared/validators.py

Reusable input validation helpers (phone, GSTIN, etc.).
"""

import re


def validate_phone(phone: str) -> bool:
    """Validate 10-15 digit international or domestic phone numbers."""
    cleaned = re.sub(r"[\s\-\(\)\+]", "", phone)
    return 7 <= len(cleaned) <= 15 and cleaned.isdigit()


def validate_gst_number(gst_number: str) -> bool:
    """
    Validate 15-character Indian GSTIN format:
    2 digits (state code) + 5 letters (PAN) + 4 digits + 1 letter + 1 char + 'Z' + 1 checksum digit/char.
    """
    pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
    return bool(re.match(pattern, gst_number.upper()))
