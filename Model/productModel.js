let{Product} = require('../Schema/productionSchema')
let joi=require('joi');

// <-------------------------------------------------------Product create ------------------------------->

async function createProduct(params){
    let valid = await check(params).catch((err)=>{
        return {error:err};
    });
    if(! valid || (valid && valid.error)){
        console.log("zaki")
        return {error : valid.error}
    }

    let userData={
        Name:params.Product_Name,
        Price:params.Product_price,
        Description:params.product_Description
    }
    let data=await Product.create(userData).catch((err)=>{
        return {error:err};
    })
    if(!data || (data && data.error)){
        console.log(data)    
        return {error:'internal server error'}
    }
    return {data : data}
}

//joi
//schema
 async function check (data){
    let schema = joi.object({
        Product_Name:joi.string().min(1).max(25).required(),
        Product_price:joi.string().required(),
        product_Description:joi.string().min(1).max(100).required()       
    })
    //validate
    let = valid = await schema.validateAsync(data).catch((err)=>{
        return {error:err}
    })
    if(! valid || (valid && valid.error)){
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message)
        }
        return {error:msg}
    }
    return {data : valid}
}


//export

module.exports={createProduct}