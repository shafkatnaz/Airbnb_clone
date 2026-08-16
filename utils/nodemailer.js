const nodemailer = require("nodemailer");

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Email Verification
async function sendVerificationEmail(email, verificationLink) {

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `
            <p>This is an account verification email.</p>
            <p>Click the link below to verify your account:</p>
            <p>
                <a href="${verificationLink}">
                    Verify Email
                </a>
            </p>
        `
    });

    if (error) {
        console.log("Email error:", error);
        throw new Error(error.message);
    }

    console.log("Verification email sent:", data);
}
// Password Reset
async function sendPasswordResetEmail(email, resetLink) {

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
            <p>You requested to reset your password.</p>

            <p>
                Click the link below to choose a new password:
            </p>

            <p>
                <a href="${resetLink}">
                    Reset Password
                </a>
            </p>
        `
    });

    if (error) {
        console.log("Email error:", error);
        throw new Error(error.message);
    }

    console.log("Password reset email sent:", data);
}
module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};


