import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path"


export const loadContent = async (templateName, placeholder) => {

    try {
        const filePath = path.join("./service/emailTemplates", `${templateName}.html`);
        let content = await fs.readFile(filePath, "utf-8");

        for (const [key, value] of Object.entries(placeholder)) {
            content = content.replace(new RegExp(`{${key}}`, "g"), value);
        }
        return content;

    } catch (err) {
        console.log("Error loading email template cotent: ", err);
        throw err;
    }
}


export const sendEmail = async (to, subject, templateName, placeholder) => {

    try {

        const emailBody = await loadContent(templateName, placeholder);
        const transpoter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            rejectUnauthorized: false,
        });

        const mailOption = {
            from: process.env.EMAIL_ADDRESS,
            to,
            subject,
            html: emailBody
        }
        setImmediate(async () => {
            try {
            const info = await transpoter.sendMail(mailOption);
            console.log("Email sent: ", info.response);
            } catch (err) {
                console.log("Error sending email: ", err);
            }
        });
    } catch (err) {
        console.log("Email not sent: ", err);
    }
}