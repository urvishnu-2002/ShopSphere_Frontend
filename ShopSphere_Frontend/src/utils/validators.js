/**
 * validators.js — Centralised validation rules for ShopSphere
 * Used across: SignUp, Login, Address, Vendor Reg, Delivery Reg, BankDocs, VehicleOps, IdentityDetails
 */

// ── Username ───────────────────────────────────────────────────────────────────
// Must be alphabets only, >3 chars, no spaces/numbers/special chars
export const validateUsername = (v) => {
    if (!v || v.trim().length === 0) return "Username is required.";
    if (/[^a-zA-Z]/.test(v)) return "Username must contain only letters (no numbers, spaces, or special characters).";
    if (v.length <= 3) return "Username must be more than 3 characters.";
    return null;
};

// ── Email ──────────────────────────────────────────────────────────────────────
// Must be valid email with @ and acceptable TLD
export const validateEmail = (v) => {
    if (!v || v.trim().length === 0) return "Email is required.";
    if (/\s/.test(v)) return "Email must not contain spaces.";
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(com|in|org|net|co\.in|edu|gov|info|biz|io|ai)$/i;
    if (!emailPattern.test(v)) return "Enter a valid email address (e.g. user@example.com).";
    return null;
};

// ── Password ──────────────────────────────────────────────────────────────────
// Min 8 chars, 1 uppercase, 1 number, 1 special char, no spaces
export const validatePassword = (v) => {
    if (!v || v.length === 0) return "Password is required.";
    if (/\s/.test(v)) return "Password must not contain spaces.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(v)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(v)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v)) return "Password must contain at least one special character.";
    return null;
};

// ── Name (person / address) ───────────────────────────────────────────────────
// >3 chars, no numbers, no special chars (allow spaces), no leading/trailing spaces
export const validateName = (v, label = "Name") => {
    if (!v || v.trim().length === 0) return `${label} is required.`;
    if (v.trim().length <= 3) return `${label} must be more than 3 characters.`;
    if (/[0-9]/.test(v)) return `${label} must not contain numbers.`;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v)) return `${label} must not contain special characters.`;
    if (/\s{2,}/.test(v)) return `${label} must not have multiple consecutive spaces.`;
    return null;
};

// ── Phone ──────────────────────────────────────────────────────────────────────
// Exactly 10 digits, no spaces, no special chars
export const validatePhone = (v) => {
    if (!v || v.trim().length === 0) return "Phone number is required.";
    if (/\s/.test(v)) return "Phone number must not contain spaces.";
    if (!/^\d{10}$/.test(v)) return "Phone number must be exactly 10 digits.";
    return null;
};

// ── Pincode / Postal Code ──────────────────────────────────────────────────────
// Exactly 6 digits for India
export const validatePincode = (v) => {
    if (!v || v.trim().length === 0) return "Pincode is required.";
    if (!/^\d{6}$/.test(v)) return "Pincode must be exactly 6 numeric digits.";
    return null;
};

// ── City name ──────────────────────────────────────────────────────────────────
export const validateCity = (v) => {
    if (!v || v.trim().length === 0) return "City is required.";
    if (/[0-9]/.test(v)) return "City name must not contain numbers.";
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v)) return "City name must not contain special characters.";
    return null;
};

// ── GST Number ──────────────────────────────────────────────────────────────────
// Format: 2 digits + 5 uppercase letters + 4 digits + 1 letter + 1 char + 1 digit + 1 char
// e.g. 27ABCDE1234F1Z5
export const validateGST = (v) => {
    if (!v || v.trim().length === 0) return "GST number is required.";
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstPattern.test(v.toUpperCase())) return "Invalid GST number format (e.g. 27ABCDE1234F1Z5).";
    return null;
};

// ── PAN Number ──────────────────────────────────────────────────────────────────
// Format: ABCDE1234F — 5 uppercase letters, 4 digits, 1 uppercase letter
export const validatePAN = (v) => {
    if (!v || v.trim().length === 0) return "PAN number is required.";
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(v.toUpperCase())) return "Invalid PAN format (e.g. ABCDE1234F).";
    return null;
};

// ── Aadhaar Number ─────────────────────────────────────────────────────────────
// Exactly 12 digits
export const validateAadhaar = (v) => {
    if (!v || v.trim().length === 0) return "Aadhaar number is required.";
    const cleaned = v.replace(/\s+/g, "");
    if (!/^\d{12}$/.test(cleaned)) return "Aadhaar number must be exactly 12 digits.";
    if (/^0/.test(cleaned) || /^1/.test(cleaned)) return "Aadhaar number must not start with 0 or 1.";
    return null;
};

// ── Driving License ───────────────────────────────────────────────────────────
// India DL format: XX00 00000000000 (state code + RTO + year + serial)
// e.g. MH1220220012345 or DL0120210012345
export const validateDrivingLicense = (v) => {
    if (!v || v.trim().length === 0) return "Driving license number is required.";
    const dl = v.replace(/[\s\-]/g, "").toUpperCase();
    const dlPattern = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/;
    if (!dlPattern.test(dl)) return "Invalid driving license format (e.g. MH1220220012345).";
    return null;
};

// ── IFSC Code ──────────────────────────────────────────────────────────────────
// Format: 4 uppercase letters + 0 + 6 alphanumeric chars
export const validateIFSC = (v) => {
    if (!v || v.trim().length === 0) return "IFSC code is required.";
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(v.toUpperCase())) return "Invalid IFSC code (e.g. SBIN0001234).";
    return null;
};

// ── Bank Account Number ────────────────────────────────────────────────────────
// 9 to 18 digits, no spaces or special chars
export const validateBankAccount = (v) => {
    if (!v || v.trim().length === 0) return "Bank account number is required.";
    if (/\s/.test(v)) return "Account number must not contain spaces.";
    if (!/^\d{9,18}$/.test(v)) return "Account number must be 9–18 digits only.";
    return null;
};

// ── Vehicle Registration Number ────────────────────────────────────────────────
// India format: XX00XX0000 or XX00X0000 etc.
// State code (2 letters) + district code (2 digits) + series (1-3 letters) + number (4 digits)
export const validateVehicleNumber = (v) => {
    if (!v || v.trim().length === 0) return "Vehicle number is required.";
    const vn = v.replace(/[\s\-]/g, "").toUpperCase();
    // Accepts formats like: MH12AB1234, KA01X1234, TN09C1234, DL4CAB1234
    const vnPattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
    if (!vnPattern.test(vn)) return "Invalid vehicle number (e.g. MH12AB1234, KA01X1234).";
    return null;
};

// ── Date of Birth ──────────────────────────────────────────────────────────────
// Must be valid date, age >= 18
export const validateDOB = (v) => {
    if (!v || v.trim().length === 0) return "Date of birth is required.";
    const dob = new Date(v);
    if (isNaN(dob.getTime())) return "Enter a valid date of birth.";
    const today = new Date();
    const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) return "You must be at least 18 years old.";
    if (age > 80) return "Please enter a valid date of birth.";
    return null;
};

// ── Store / Business Name ──────────────────────────────────────────────────────
export const validateStoreName = (v) => {
    if (!v || v.trim().length === 0) return "Store name is required.";
    if (v.trim().length < 3) return "Store name must be at least 3 characters.";
    if (/[!@#$%^&*()\[\]{};':"\\|<>?`~]/.test(v)) return "Store name must not contain special characters.";
    return null;
};

// ── Helper: run multiple validators and return first error ─────────────────────
export const runValidations = (rules) => {
    for (const [value, validator, args] of rules) {
        const err = args ? validator(value, ...args) : validator(value);
        if (err) return err;
    }
    return null;
};
