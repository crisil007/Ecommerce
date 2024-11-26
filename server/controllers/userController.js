const users = require('../db/models/users');
const user_type = require("../db/models/user_type"); 
const AddData=require("../db/models/addproduct")
const bcrypt = require('bcrypt');
const { success_function, error_function } = require("../utils/responseHandler"); 
const mongoose = require("mongoose");
const fileUpload=require("../utils/fileUpload").fileUpload;
const category = require('../db/models/category');

exports.createuser = async (req, res) => {
    try {
        let body = req.body;
        console.log("Received body:", body);

        let password = body.password;
        let user_type_value = body.user_type; 

        
        if (!user_type_value) {
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "User type is required"
            }));
        }

        
        user_type_value = user_type_value.toLowerCase().trim();

        
        const UserType = await user_type.findOne({user_type:user_type_value }); 

        if (!UserType) {
            console.log("User type not found:", user_type_value); 
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "Invalid user type"
            }));
        }

        console.log("UserType found:", UserType);

        
        let salt = bcrypt.genSaltSync(10);
        let hashed_password = bcrypt.hashSync(password, salt);

        
        let randombody = {
            name: body.name,
            email: body.email,
            password: hashed_password,
            phoneno: body.phoneno,
            user_type: UserType._id, 
        };

    
        let new_user = await users.create(randombody);

        if (new_user) {
            const response = success_function({
                statusCode: 200,
                message: "User created successfully",
                data: new_user
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            console.log("User creation failed");
            res.status(400).send(error_function({
                statusCode: 400,
                message: "User creation failed"
            }));
            return;
        }

    } catch (error) {
        console.log("Error in createuser:", error);
        res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
        return;
    }
};
exports.addProducts = async (req, res) => {
    try {
        const body = req.body;
        let image = body.image;  // Original base64 image from the request

        // Create the product data object without the image for now
        const data = {
            name: body.name,
            price: body.price,
            image: "",  // Start with an empty image field
        };

        // Check if there is an image in the body
        if (image) {
            // Check if the image is in base64 format
            const regExp = /^data:/;
            const result = regExp.test(image);

            if (result) {
                // Image is in base64 format, so upload it and get the path
                const img_path = await fileUpload(image, "user");  // Upload the image
                console.log("img_path:", img_path);

                // Update the image path in the 'body' and 'data'
                body.image = img_path;  // Set the image path
                data.image = img_path;  // Set the image path for the new product
            }
        }

        // Now create the product with the correct image path
        const products = await AddData.create(data);
        console.log(products);

        // Respond with success
        res.status(200).send({
            success: true,
            message: "Product added successfully",
            data: products
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).send({
            success: false,
            message: "Error adding product"
        });
    }
};
exports.getProducts = async function(req,res){
    try {
        let productData = await AddData.find();
        console.log("productData",productData);

        if(!productData){
            let response = error_function({
                success  : false,
                statusCode : 400,
                
            });
            return res.status(response.statusCode).send(response);
            
        }else{
            let response = success_function({
                success : true,
                statusCode : 200,
                message : "fetching successfull",
                data : productData,
            });
            return res.status(response.statusCode).send(response);
            
        }

    } catch (error) {
        console.log("error",error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "something went wrong",
        });
        return res.status(response.statusCode).send(response);
        
    }
}


