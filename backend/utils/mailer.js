// utils/mailer.js
import nodemailer from "nodemailer";
import path from "path";

export const sendCandidateEmail = async ({
    to,
    subject,
    html,
    attachmentPath,
    attachmentName,
}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });


    const mailOptions = {
        from: `"Info@galhotragroup.com" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments: attachmentPath
            ? [{ filename: attachmentName, path: attachmentPath }]
            : [],
    };

    return await transporter.sendMail(mailOptions);
};
