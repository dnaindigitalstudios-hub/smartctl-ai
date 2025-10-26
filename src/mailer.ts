import {createTransport} from "nodemailer";

export const transport = createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "25", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || "",
    } : undefined,
});
