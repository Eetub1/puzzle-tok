import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: undefined
})

// Helper that sends the wanted text to the specified address
export const sendMail = async ({ to, subject, text }) => {
    await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, text })
}