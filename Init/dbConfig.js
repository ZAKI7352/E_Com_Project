let{Sequelize, Model, DataTypes, Op, QueryTypes}=require('sequelize');
let SequelizeCon=new Sequelize('Mysql://root@localhost/demo');
SequelizeCon.authenticate().then(()=>{
    console.log("Database is connected")
}).catch((err)=>{
    console.log('error',err)
});
// SequelizeCon.sync({alter:true});
module.exports={
    SequelizeCon,
    Model,
    DataTypes,Op, QueryTypes
};
