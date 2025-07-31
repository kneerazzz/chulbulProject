import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail  = async({to, subject, text, html}) => {
    try {
        const info = await transporter.sendMail({
            from: `"RAT" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })

        console.log("email send : ", info.messageId)
        
    } catch (error) {
        console.log("error sending email", error.message)
        throw error  
    }
}