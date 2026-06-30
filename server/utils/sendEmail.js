const nodemailer = require('nodemailer');
const https = require('https');

const sendEmail = async (options) => {
    // 1. If Brevo HTTP API is configured, use it.
    // This is immune to SMTP port blocks on Render, AWS, and home ISPs because it uses HTTPS (Port 443)
    if (process.env.BREVO_API_KEY) {
        console.log(`[Email] Sending to ${options.email} via Brevo HTTP API...`);
        return new Promise((resolve, reject) => {
            const data = JSON.stringify({
                sender: {
                    name: 'PizzaXpress',
                    email: process.env.EMAIL_USER // This must be your verified Brevo sender email
                },
                to: [{ email: options.email }],
                subject: options.subject,
                textContent: options.message
            });

            const reqOptions = {
                hostname: 'api.brevo.com',
                port: 443,
                path: '/v3/smtp/email',
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(data)
                }
            };

            const req = https.request(reqOptions, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log(`[Email] Sent successfully via Brevo API to ${options.email}`);
                        resolve(JSON.parse(responseBody));
                    } else {
                        console.error(`[Email] Brevo API Error (Status ${res.statusCode}):`, responseBody);
                        reject(new Error(`Brevo API returned status ${res.statusCode}`));
                    }
                });
            });

            req.on('error', (err) => {
                console.error("[Email] Brevo HTTPS Network Error:", err);
                reject(err);
            });

            req.write(data);
            req.end();
        });
    }

    // 2. Fallback: Standard Gmail SMTP Configuration
    console.log(`[Email] BREVO_API_KEY not configured. Falling back to Gmail SMTP on Port 465...`);
    
    // Debug environment variable presence without printing sensitive credentials
    console.log(`[Email] EMAIL_USER present: ${!!process.env.EMAIL_USER}`);
    console.log(`[Email] EMAIL_PASS present: ${!!process.env.EMAIL_PASS}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        debug: true,
        logger: true // Enable internal Nodemailer logging
    });

    // Test transporter connection
    try {
        console.log("[Email] Verifying SMTP Connection...");
        await transporter.verify();
        console.log("[Email] SMTP Connection verified successfully.");
    } catch (verifyError) {
        console.error("[Email] SMTP Transporter Verification Failed:", verifyError);
        throw new Error(`SMTP connection timed out or auth failed: ${verifyError.message}`);
    }

    const mailOptions = {
        from: `PizzaXpress <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent successfully to ${options.email} via SMTP`);
};

module.exports = sendEmail;
