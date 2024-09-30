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
    console.log(req.body);
    const { emails, subject, emailMessage } = req.body;

    if (!emails || !subject || !emailMessage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(emails) || emails.some(email => !email)) {
        return res.status(400).json({ error: 'Invalid email addresses' });
    }

    const uniqueEmails = [...new Set(emails)];

    const message = {
        from: process.env.EMAIL_USER,
        subject: subject,
        text: emailMessage,
    };

    try {
        const results = await Promise.all(
            uniqueEmails.map(email => {
                return new Promise((resolve, reject) => {
                    transporter.sendMail({ ...message, to: email }, (err, info) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(info);
                        }
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