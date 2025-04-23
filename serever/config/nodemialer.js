import nodemiler from 'nodemailer';
const transporter = nodemiler.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SENDER_EMAIL,
        pass : process.env.SENDER_PASS,
    },
    debug : true,
    logger: true
})
export default transporter;