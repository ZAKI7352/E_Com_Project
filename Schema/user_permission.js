let {SequelizeCon, Model, DataTypes}=require('../Init/dbConfig');
class user_permission extends Model{}
// SequelizeCon.sync({alter:true});


user_permission.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    permission_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{tableName:'user_permission', ModelName:'User_permission',sequelize:SequelizeCon})

module.exports={user_permission}