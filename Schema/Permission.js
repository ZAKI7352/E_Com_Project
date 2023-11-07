let {SequelizeCon, Model, DataTypes}=require('../Init/dbConfig')
class Permission extends Model {}
SequelizeCon.sync({alter:true});

Permission.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{tableName:'permission',ModelName:'Permission',sequelize:SequelizeCon});

//export file
module.exports={Permission}