import nodemailer from "nodemailer"
import crypto from "node:crypto"
import pool from "../db/db.js"

const TIME_TO_VERIFY_EMAIL_HOURS = 24

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: undefined
})

const hashToken = token => crypto.createHash("sha256").update(token).digest("hex")

const sendVerificationEmail = async user => {
    // Create a verification token, which the user sends back after clicking the verification link
    const token = crypto.randomBytes(32).toString("hex")
    // Need to create a hash of the token. Can't store it directly in the database
    const hashedToken = hashToken(token)

    await pool.query(
        `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, now() + make_interval(hours => $3))`, // add expire hours to current time
        [user.id, hashedToken, TIME_TO_VERIFY_EMAIL_HOURS],
    )

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    await sendMail({
        to: user.email,
        subject: "Verify your PuzzleTok email address",
        text: `Link to verify your email address:\n${verifyUrl}\n\n`
            + `The link is valid for ${TIME_TO_VERIFY_EMAIL_HOURS} hours. `
    })
}

// Helper that sends the wanted text to the specified address
const sendMail = async ({ to, subject, text }) => {
    await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, text })
}

export {
    sendMail,
    sendVerificationEmail,
    hashToken
}