let {SequelizeCon,QueryTypes} = require ('../Init/dbConfig');
let security = require('../Helpers/security');

//check if token exist in req header
function authM (permission){
    return async (req, res, next)=>{
        let token = req.session.token
        if (typeof (token) != "string"){
            return res.redirect('/login?msg=not valid user')
        }
        
        //Decrypt the token
        let decrypt = await security.decrypt(token,"#qwertyu@").catch((err)=>{
            return {error:err}
        });
        if(!decrypt || (decrypt && decrypt.error)){
            return res.redirect('/login?msg=id not matched')
        }

        //chech in db if the id has the given token
        let query = `select user.id,user.Name,user.Email,user.Contact,p.name as permission
        from user
        left join user_permission as Up
        on user.id = up.user_id
        left join permission as p
        on up.permission_id = p.id
        where user.id = '${decrypt.id}' and token = '${token}'`;

        let user = await SequelizeCon.query(query,{
            type:QueryTypes.SELECT}).catch((err)=>{
                return {error:err}
            })
        if(!user || (user && user.error)){
            return res.redirect('/login?msg=erorr')
        }

        //formate all permission from db against the userid
        let Permissions = {}
        for (let i of user){
            if(i.permission){
                Permissions[i.permission] = true;
            }
        }

        //check if user have permission
        if(Permissions.length <= 0 || !Permissions[permission]){
            return res.redirect('/login?msg=NOt authorized')
        }
        
        //same user details in request
        req['userData'] = {
            Name:user[0].Name,
            id:user[0].id,
            Email:user[0].Email,
            Contact:user[0].Contact,
            Permissions
        }
        
        next();
    }
} 

module.exports = {authM}

