let express=require('express');
let router=express.Router();
let user=require('./Controller/UserController');
let product=require('./Controller/ProductController');
let auth = require('./Controller/auth_controller');
let {authM} = require('./Middleware/auth_Middleware');
let Dashboard = require ('./Controller/Dashboard');

//user auth routes
router.get('/',auth.index);
router.get ('/login',auth.index);
router.post('/registerU', auth.Register);
router.post('/login', auth.loginPage);

router.get('/Dashboard',authM('user'),Dashboard.Dashboard);
router.post('/user',user.createUser); 

//product routes
router.get('/product/create',authM('product_create'),product.addUI);
router.post('/product/create',authM('product_create'),product.newproduct);
router.get('/product',authM('product_view'),product.veiwAll);
router.get('/product/:id',authM('product_view'),product.viewDetail);
router.get('/product/update/:id',authM('product_update'),product.updateUI);
router.post('/product/:id',authM('product_update'),product.update);
router.post('/product/delete/:id',authM('product_delete'),product.pDelete);
router.post('/product/restore/:id',authM('product_restore'),product.prestore);



//mailer
router.get('/forget',auth.forgetpassUi)
router.post('/F_password',auth.forget_pass)

//login, register routes
router.get('/jquery',product.register_Login)
//redirecr page
router.get('/redirect',auth.index);


module.exports = {router}