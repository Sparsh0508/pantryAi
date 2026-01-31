import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendVerificationEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"PantryIQ" <noreply@pantryiq.com>',
            to: email,
            subject: 'Verify Your Email - PantryIQ',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Welcome to PantryIQ!</h2>
                    <p>Please enter the following code to verify your email address:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px;">
                        <h1 style="letter-spacing: 5px; color: #333;">${code}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const sendInviteEmail = async (email, inviteLink, inviterName) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"PantryIQ" <noreply@pantryiq.com>',
            to: email,
            subject: 'Join Family - PantryIQ',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">You're Invited!</h2>
                    <p><strong>${inviterName}</strong> has invited you to join their family on PantryIQ.</p>
                    <p>Click the button below to accept the invitation and start sharing lists and plans!</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${inviteLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
                    </div>
                    <p>Or paste this link in your browser:</p>
                    <p><a href="${inviteLink}">${inviteLink}</a></p>
                    <p>If you didn't expect this, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Invite Email sent: ' + info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
