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

const sendEmail = (req, res) => {
    console.log(req.body);
    const { email, subject, emailMessage } = req.body;

    if (!email || !subject || !emailMessage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: emailMessage,
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        console.log('Message sent: %s', info.messageId);
        return res.status(200).json({
            message: 'Email sent successfully',
            messageId: info.messageId
        });
    });
};

export default sendEmail;