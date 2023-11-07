let auth_model = require ('../Model/auth_model');

//register
async function register_ui(req,res){
    res.render('register',{});
}

async function Register (req,res){
    let modelData1 = await auth_model.register(req.body).catch((err)=>{
        return {error:err}
    });
    if(!modelData1 || (modelData1 && modelData1.error)){
        let error = (modelData1 && modelData1.error)?
        modelData1.error:'internal server error';
        return res.send({error})
    }
    // return res.send({data:modelData1.data})
    return res.redirect("/?msg=success")
}

//login
async function loginPage (req,res){
    let modelData2 = await auth_model.login(req.body).catch((err)=>{
        return {error:err}
    })
    console.log('data',modelData2)
    if(!modelData2 || (modelData2 && modelData2.error)){
        let error = (modelData2 && modelData2.error)?
        modelData2.error:'internal server error2';
        return  res.send({error});
    }
    req.session.token = modelData2.token
    return res.redirect("/Dashboard");
    // return res.send({data:modelData2.data})
}
async function index(req,res){
    res.render("jquery",{})
}

//forgot password
async function forget_pass(req,res){
    let forgetData = await auth_model.F_password(req.body).catch((err)=>{
        return {error:err}
    })
    console.log("for",forgetData)
    if (!forgetData || (forgetData && forgetData.error)){
        let error = (forgetData && forgetData.error) ? forgetData :"Internal server error"
        return res.send({error})
    }
    return res.send({data:forgetData})
}
//render 
async function forgetpassUi(req,res){
    return res.render("forgetpassword",{})
}



module.exports={Register,loginPage,register_ui,index,forgetpassUi,forget_pass}