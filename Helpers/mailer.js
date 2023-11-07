let mailer = require ('nodemailer');
function mail (mailOption){
    return new Promise ((res,rej)=>{
        let transporter = mailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth: {
                 user:"mdzaki7352@gmail.com",
                 pass: "schu vaxw qnsx lerd"
            }
        })
        transporter.sendMail(mailOption,(err,info)=>{
            if(err){
                console.log(err)
                return rej (err)
            }
            return res (`mail is send to ${mailOption.to}`)
        })
    })
}
module.exports = {mail}