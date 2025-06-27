import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendVerificationCode(email, code) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL_NAME,
            pass: process.env.SENDER_EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL_NAME,
        to: email,
        subject: 'Your verification code',
        text: `Your verification code is: ${code}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        
        return false;
    }
}

export function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
