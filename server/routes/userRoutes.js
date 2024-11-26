const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController')

router.post('/users',userController.createuser),
router.post('/addproduct',userController.addProducts),
router.get('/getproducts',userController.getProducts)

module.exports=router