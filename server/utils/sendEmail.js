const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For production, suggest using SendGrid, Mailgun, or AWS SES
    // For dev/test, use Ethereal or Gmail (with App Password)
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `PizzaXpress <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: if you want to send HTML emails
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.log("Email service failed (expected in dev without creds).");
        console.log("--- SIMULATED EMAIL ---");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("-----------------------");
        // Don't throw error so flow continues
    }
};

module.exports = sendEmail;
