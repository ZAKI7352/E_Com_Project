let{SequelizeCon, Model, DataTypes}=require('../Init/dbConfig')
class User extends Model{}
// SequelizeCon.sync({alter:true});
User.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey: true
    }, 
    Name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Contact:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    // Otp:{
    //     type:DataTypes.STRING,
    //     allowNull:false
    // },
    
    Password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    is_active:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:true,
    },
    is_deleted:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:false
    },
    token:{
        type:DataTypes.STRING(500),
        allowNull:true
    },
},
{tableName:'user',ModelName:"User",sequelize:SequelizeCon});

//export file
module.exports={User}