const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Using port 465 and secure: true is much more reliable on cloud providers like Render
    // because port 587 is often blocked or throttled to prevent spam.
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Add timeouts so the frontend doesn't hang forever if the connection is blocked
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true, // enable debug logs for Render console
    });

    const mailOptions = {
        from: `PizzaXpress <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error("Nodemailer Error Details:", error);
        throw new Error('Email could not be sent. Connection failed.');
    }
};

module.exports = sendEmail;
