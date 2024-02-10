const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = {
    sendRegisterOtp : async function(username , emailId , Otp) {
        try{

            console.log(process.env.AUTH)
            const transporter = await nodemailer.createTransport({
                service: "gmail",
                secure: false,
                auth  :{
                    user : process.env.AUTH,
                    pass : process.env.PASS
                }
            });
    
            const info = await transporter.sendMail({
                from : {
                    name : "Ayush Barman",
                    address : process.env.AUTH
                },
                to : emailId,
                subject : "Account Verification for Parakram 24' ",
                // text : "",
                html : `<h1>${Otp} is your one time password for your account login !!</h1>`
            })
            return {success : true , info : info};
        }
        catch(e){
            console.log(e);
            return {success : false , err : e}
        }
    },
    sendPassChangeOtp : async function(username , emailId , Otp) {
        try{

            console.log(process.env.AUTH)
            const transporter = await nodemailer.createTransport({
                service: "gmail",
                secure: false,
                auth  :{
                    user : process.env.AUTH,
                    pass : process.env.PASS
                }
            });
    
            const info = await transporter.sendMail({
                from : {
                    name : "Ayush Barman",
                    address : process.env.AUTH
                },
                to : emailId,
                subject : "Password Change",
                // text : "",
                html : `<h1>${Otp} is your one time password for your password Change !!</h1>`
            })
            return {success : true , info : info};
        }
        catch(e){
            console.log(e);
            return {success : false , err : e}
        }
    }
}