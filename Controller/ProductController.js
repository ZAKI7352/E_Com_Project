let productModel=require('../Model/productModel');
let product1 = require ('../Model/product');
const { request } = require('express');
const { func } = require('joi');


//this is connected with ejs file
function register_Login(req,res){
    return res.render('jquery',{});
}

async function addUI(req,res){
    return res.render('product/add');
}

async  function newproduct(req,res){
    let modelData = await productModel.createProduct(req.body).catch((err)=>{
        return {error:err}
    });
    console.log('data',modelData)
    if(!modelData || (modelData && modelData.error)){
        let error = (modelData && modelData.error)?
        modelData.error:'internal server error';
        return res.send({error})
    }
    // return res.send({data:modelData.data})
    return res.redirect("/product");

}
async function veiwAll(req,res){
    let product = await product1.veiwAll(req.query,req.userData.Permissions).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        return res.render ('product/view',{error:product.error})
    }
    return res.render('product/view',{products:product.data, page:product.page, total:product.total, limit:product.limit,Permissions:req.userData.Permissions})
};



async function viewDetail(req,res){
    let product = await product1.viewDetail(req.params.id).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        return res.render('/product/view',{error : product.error})
    }
    return res.render('product/details',{products : product.data})
};

async function updateUI(req,res){
    let product = await product1.viewDetail(req.params.id).catch((err)=>{
        return {error:err}
    })
    if(!product || (product && product.error)){
        let url = (product1 && product1.data && product1.data.id) ? '/product/'+ product.data.id:'/product';
        return res.redirect(url);
    }    
    return res.render('product/update',{products : product.data})
}

async function update(req,res){
    let product = await product1.update(req.params.id,req.body).catch((err)=>{
        return {error:err}
    })
   
    if(!product || (product && product.error)){
        let url = (product1 && product1.data && product1.data.id) ? '/product/' + product.data.id:'/product';
        return res.redirect(url);
    }
    

    let url = (product && product.data && product.data.id) ? '/product/'+ product.data.id:'/product';
    return res.redirect(url);
}

async function pDelete(req,res){
    let product = await product1.pDelete(req.params.id).catch((err)=>{
        return {error:err}
    })
   
    if(!product || (product && product.error)){
        let url = (req.params && req.params.id) ? '/product/' + req.params.id:'/product';
        return res.redirect(url);
    }
    return res.redirect("/product")
}
async function prestore(req,res){
    let product = await product1.prestore(req.params.id).catch((err)=>{
        return {error:err}
    })
   console.log("product error",product)
    if(!product || (product && product.error)){
        let url = (req.params && req.params.id) ? '/product/' + req.params.id:'/product';
        return res.redirect(url);
    }
    return res.redirect("/product")
}
module.exports={
    newproduct,
    register_Login,
    veiwAll,
    viewDetail,
    updateUI,
    update,
    addUI,
    pDelete,
    prestore
}