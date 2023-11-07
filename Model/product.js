let joi  = require('joi');
let {Product} = require ('../Schema/productionSchema')

// <-------------------------------------------------------Product View all product------------------------------->

async function veiwAll (params,Permissions){
    let limit = (params.limit)? parseInt(params.limit):8;
    let page = (params.page)? parseInt(params.page):1;
    let offset = (page - 1)* limit

    let where = {};
    if(!Permissions.product_restore){
        where = {is_deleted:false}
    }

    let counter = await Product.count().catch((err)=>{
            return {error:err}
        })
        if(!counter||(counter && counter.error)){
            return {error:'Internal Server Error1'}
        }
        if(counter<=0){
            return {error:'this data is not defined'}
        }


    let data = await Product.findAll({limit,offset,row:true,where}).catch((err)=>{
        return {error:err}
    })
    if (!data || (data && data.error)){
        return {error:'internal server error',status:500}
    }

    return {data:data,total:counter,page,limit}
}

async function viewDetail(id){
    let data = await Product.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    if (!data || (data && data.error)){
        return {error:'internal server error',status:500}
    }
    return {data}
}

// <-------------------------------------------------------Product Update ------------------------------->

async function checkUpdate(data){
    let schema = joi.object({
        id:joi.number().required(),
        Product_Name:joi.string().min(1).max(25),
        Product_price:joi.number().required(),
        product_Description:joi.string().min(1).max(100),       
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

async function update(id,params){
    params.id=id;
    //user data validation
    let valid = await checkUpdate(params).catch((err)=>{
        return {error:err}});
    if (!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    //check product in db
    let data = await Product.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    if (!data || (data && data.error)){
        return {error : "Internal server error",status:500}
    }    

    //format product data
    productData={
    Name:params.Product_Name,
    Price:params.Product_price,
    Description:params.product_Description
    }
    //update record in db
    let updateProduct = await Product.update(productData,{where:{id}}).catch((err)=>{
        return {error:err}
    })
    
    if (!updateProduct || (updateProduct && updateProduct.error)){
        return {error : "Internal server error",status:500}
    }
    return { data : data}
}

// <-------------------------------------------------------Product Delete------------------------------->

async function checkDelete(data){
    let schema = joi.object({
        id:joi.number().required(),
    })
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

async function pDelete(id,decision){
    //user data validation
    let valid = await checkDelete({id}).catch((err)=>{
        return {error:err}
    });
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    //check if product exist
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error: "internal server errro",status :500}
    }

    //check if product is already delete
    if(data.is_deleted == decision){
        return {error:"product is already deleted"}
    }

    //update product table
    let updateProduct =  await Product.update({is_deleted:decision},{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error: "internal server errro",status :500}
    }

    if(updateProduct <= 0){
        return {error : "Record is not deleted"}
    }

    //return data

    return {data:"Record Sucessfully deleted"}

}

// <-------------------------------------------------------Product Restore------------------------------->
/*
async function prestore(id){
    //user data validation
    let valid = await checkDelete({id}).catch((err)=>{
        return {error:err}
    });
    if(!valid || (valid && valid.error)){
        return {error:valid.error}
    }

    //check if product exist
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error:err}
    })
    if(!data || (data && data.error)){
        return {error: "internal server errro",status :500}
    }

    //check if product is already delete
    if(data.is_deleted == false){
        return {error:"product is already restored"}
    }

    //update product table
    let updateProduct =  await Product.update({is_deleted:false},{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error: "internal server errro",status :500}
    }

    if(updateProduct <= 0){
        return {error : "Record is not restored"}
    }

    //return data

    return {data:"Record Sucessfully restored"}

}
*/

//export
module.exports={
    veiwAll,
    viewDetail,
    update, 
    pDelete,
    // prestore
}