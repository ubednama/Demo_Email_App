import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (req, res) => {
    const { emails, subject, emailMessage } = req.body;

    if (!emails || !emailMessage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(emails) || emails.some(email => !email)) {
        return res.status(400).json({ error: 'Invalid email addresses' });
    }

    const uniqueEmails = [...new Set(emails)];

    const warningMessage = `
        <br><br>
        <strong>Warning:</strong> This email was sent using a dummy project. Please do not take this email seriously.
        <br><br>
        <strong>Project Repository</strong><br>
        <a href="https://github.com/ubednama/Demo_Email_App">GitHub Repository</a>
        <br><br>
        <strong>Project Deployment</strong><br>
        <a href="https://full-stack-email-app.onrender.com/">Deployed Application</a>
    `;
    const fullEmailMessage = emailMessage + warningMessage;

    const message = {
        from: process.env.EMAIL_USER,
        subject: subject,
        html: fullEmailMessage,
    };

    try {
        const results = await Promise.all(
            uniqueEmails.map(email => {
                return new Promise((resolve, reject) => {
                    transporter.sendMail({ ...message, to: email }, (err, info) => {
                        if (err) reject(err);
                        else resolve(info);
                    });
                });
            })
        );

        console.log('Messages sent:', results.map(info => info.messageId));
        return res.status(200).json({
            message: 'Emails sent successfully',
            messageIds: results.map(info => info.messageId)
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        return res.status(500).json({ error: 'Failed to send emails' });
    }
};

export default sendEmail;
