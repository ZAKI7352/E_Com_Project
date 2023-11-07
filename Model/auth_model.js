let {User} = require ('../Schema/user_schema')
let joi = require ('joi');
let security = require('../Helpers/security')
let {user_permission}=require('../Schema/user_permission');
let otpGenerator = require('otp-generator');
let {mail} = require('../Helpers/mailer')
//joi validation
async function checkUser (params){
    let schema = joi.object({
        userName:joi.string().min(3).max(12).required(),
        email:joi.string().min(7).max(30).required(),
        phone:joi.string().required(),
        password:joi.string().min(3).max(12).required()
    })

    //validation
    let valid = await schema.validateAsync(params).catch((err)=>{
        return {error:err}
    })
    if (!valid || (valid && valid.error)){
        let msg=[]
        for (let i of valid.error.details){
            msg.push(i.message);
        }
        return {error:msg}
    }
    return {data:valid}

    
}
// <------------------------------------------User Register-------------------------------------->

//register
async function register(params){
    console.log(params)
    let check = await checkUser(params).catch((err)=>{
        return {error:err}
    })
    if(!check || (check && check.error)){
        console.log("hello world");
        return  {error:check.error}
    }

    let findUser = await User.findOne({where: {Email:params.email}}).catch((err)=>{
        return {error:err}
    })
    if (findUser || (findUser && findUser.error)){
        return {error: "This user is allready exist"}
    }

    //hash the password
    let md = await security.hash(params.password).catch((err)=>{
        return {error:err}
    })
    if (!md || (md && md.error)){
        return{error:"Error in hashing"}
    }

    //formate user data(mapping)
    let userData={
        Name:params.userName,
        Email:params.email,
        Contact:params.phone,
        Password:md.data
    };

    //insert into db
    let data = await User.create (userData).catch((err)=>{
        return {error:err}
    })
    if (!data || (data && data.error)){
        console.log(data,'zaki')
        return {error:'Internal server error'}
    }
    
    //user permission
    let userpermission = {
        user_id : data.id,
        permission_id :1
    }
    let userPermissionData = await user_permission.create(userpermission).catch((err)=>{
        return {error:err}
    })
    if(!userPermissionData || (userPermissionData && userPermissionData.error)){
        console.log(userPermissionData)
        return {error:'internal server error2'}
    }
    return {data: data}
}

// <------------------------------------------User Login -------------------------------------->

//login user
async function checklogin(params){
    let schema = joi.object({
        email:joi.string().min(7).max(30).required(),
        password:joi.string().min(3).max(12).required()
    })

    //validation
    let valid = await schema.validateAsync(params).catch((err)=>{
        return {error:err}
    })
    if (!valid || (valid && valid.error)){
        let msg=[]
        for (let i of valid.error.details){
            msg.push(i.message);
        }
        return {error:msg}
    }
    return {data:valid}

    
}
async function login(params){
    let valid = await checklogin(params).catch((err)=>{
        return{error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }
    let find = await User.findOne({where: {Email:params.email}}).catch((err)=>{
        return{error:err}
    })
    if (!find || (find && find.error)){
        return  {error:"User not found"}
    }

    //compare
    let com = await security.compare(params.password,find.Password).catch((err)=>{
        return {error:err}
    })
    if(!com || (com && com.error)){
        return   {error:"wrong passsword"}
    }
    
    //genrate token
    let token = await security.encrypt({id:find.id},'#qwertyu@').catch((err)=>{
        return{error:err}
    })
    if(!token ||(token && token.error)){
        return {error:'something went wrong'}
    }

    //update token
    console.log(find.id)
    let tokenupdate = await User.update({token:token},{where:{id:find.id}}).catch((err)=>{
        return {error:err}
    })
    if(!tokenupdate||(tokenupdate && tokenupdate.error) ||(tokenupdate && tokenupdate [0]<=0)){
        return {error:'something went wrong1'}
    }
    return {data:"login sucessfully",token:token}
}

// <------------------------------------------Forgot password -------------------------------------->

//Forgot Passowrd   
async function Forgot_Password(data){
    let forgetSchema = joi.object({
        email: joi.string().email().min(6).max(25).required()
    })

    let valid = await forgetSchema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if (!valid || (valid && valid.error)){
        let msg = []
        for (let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data:valid}
}

async function F_password(params){
    console.log()
    let valid = await Forgot_Password(params).catch((err)=>{
        return {error:err}
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let find = await User.findOne({where :{Email:params.email}}).catch((err)=>{
        return {error:err}
    })
    if(!find || (find && find.error)){
        return {error:"User is not find"}
    }
    
    //Genrate otp
    let otp = otpGenerator.generate(6,{upperCaseAlphabets: false, specialChars:false,lowerCaseAlphabets:false});

    //Hash otp 
    let Hash_otp = await security.hash(otp).catch((err)=>{
        return {error:err}
    })
    if(!Hash_otp || (Hash_otp && Hash_otp.error)){
        return {error:Hash_otp.error}
    }

    let save = await User.update({otp:Hash_otp.data},{where:{id:find.id}}).catch((err)=>{
        return {error:err}
    })

    if (!save || (save && save.error)){
        return {error:save.error}
    }

    let mail_Option = {
        from: 'mdzaki7352@gmail.com',
        to:params.email,
        subject : 'for forget password',
        text : `please do not share anyone This is Your one time otp: ${otp} `
    }


    let sendmail = await mail(mail_Option).catch((err)=>{
        return   {error:err}
    })
    if(!sendmail || (sendmail && sendmail.error)){
        return {data:'mail is not sent'}
    }
    
    return{data:`Otp send to ${params.email}`}
}

module.exports={register,login,F_password}
