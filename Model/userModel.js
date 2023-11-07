let{User}=require('../Schema/user_schema');
let joi=require('joi');

async function create(params){
    let valid= await check(params).catch((err)=>{
        return {error:err};
    })
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    let userData={
        Name:params.userName,
        Email:params.email,
        Contact:params.phone,
        Password:params.password
    }
    let data=await User.create (userData).catch((err)=>{
        return {error:err};
    })
    
    if(!data || (data && data.error)){
        console.log(data)
        return {error:'internal server error'}
    }
    console.log("zaki")
    return {data : data};

}


//joi
//schema
async function check (data){
    let schema=joi.object({
        userName:joi.string().min(5).max(25).required(),
        email:joi.string().min(5).max(25).required(),
        phone:joi.string().required(),
        password:joi.string().min(5).max(25).required(),
    })
    //validate
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    
    if(!valid || (valid && valid.error)){
        let msg=[];
        for(let i of valid.error.details){
            msg.push(i.message);
        }
        return {error:msg}
    }
    return {data:valid}
}
//export
module.exports={create}