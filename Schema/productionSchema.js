let{SequelizeCon,Model,DataTypes}=require('../Init/dbConfig')
class Product extends Model{}

// SequelizeCon.sync({alter:true});
Product.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true, primaryKey: true
    },
    Name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    is_active:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:true
    },
    is_deleted:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:false
    },
},
{tableName:'product',ModelName:"Product",sequelize:SequelizeCon});

//export file
module.exports={Product}