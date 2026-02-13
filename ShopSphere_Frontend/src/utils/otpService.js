import emailjs from "@emailjs/browser";

export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpEmail = async (email, otp) => {
    return emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
            to_email: email,
            otp: otp,
        },
        "YOUR_PUBLIC_KEY"
    );
};
