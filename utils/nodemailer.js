const nodemailer = require("nodemailer");
// Create a transporter using SMTP

async function sendVerificationEmail(email, verificationLink){
    
  // Generate a test account
  const testAccount = await nodemailer.createTestAccount();

  console.log("Test account created:");
  console.log("  User: %s", testAccount.user);
  console.log("  Pass: %s", testAccount.pass);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  // Send a test message 1
  const info = await transporter.sendMail({
    from: `"Test App" <${testAccount.user}>`,
    to: email,
    
    subject: "Email verification",
    text: "This is an account verification mail.",
    html: `
        <p>Click below to verify your account.</p>
        <a href="${verificationLink}">Verify Email</a>
    `,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}
sendVerificationEmail().catch(console.error);
// 2
async function sendPasswordResetEmail(email, resetLink) {
    
  // Generate a test account
  const testAccount = await nodemailer.createTestAccount();

  console.log("Test account created:");
  console.log("  User: %s", testAccount.user);
  console.log("  Pass: %s", testAccount.pass);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
// Send a test message 2
  const info = await transporter.sendMail({
    from: `"Test App" <${testAccount.user}>`,
    to: email,
    subject: "Reset your password",
    text: "Click the link below to reset your password.",
    html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to choose a new password:</p>
        <a href="${resetLink}">Reset Password</a>
    `,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}
sendPasswordResetEmail().catch(console.error);

module.exports = {sendVerificationEmail, sendPasswordResetEmail};

