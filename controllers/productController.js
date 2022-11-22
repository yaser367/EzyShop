const productSchema = require('../models/productSchema')
const categerySchema = require('../models/categorySchema')
const brandSchema = require('../models/brandSchema')
const {cloudinary} = require('../config/cloudinary')
const getAddProduct = async(req,res)=>{
    try {
        const category_data = await categerySchema.find()   
        const brand_data = await brandSchema.find()
        // createProducts
        res.render('addProduct',{title:"createProduct",category_data,brand_data})
        
    } catch (error) {
        console.log(error)
    }
}

const postAddProduct = async(req,res)=>{
    try {
      const product = new productSchema({
        productName:req.body.productName,
        category:req.body.category,
        brand:req.body.brand,
        price:req.body.price,
        stock:req.body.stock,
        specifications:req.body.specifications,
        is_blocked:false
      })
      product.images = req.files.map( f=> ({ url: f.path,filename: f.filename}))
      await product.save()
      req.flash('success','product added')
      res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}

const getUpdateproduct = async(req,res)=>{
    try {
        const id = req.query.id;
        const product_data =await productSchema.findById({_id:id}).populate({path:'category brand'})
        const category_data = await categerySchema.find()
        const brand_data = await brandSchema.find()
        if(product_data){
            // updateProduct
        res.render('updatePro',{title:'updateProduct',product_data,category_data,brand_data})
        }else{
            res.redirect('back')
        }
    } catch (error) {
        console.log(error)
    }
}

const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params
        
        const product =  await productSchema.findByIdAndUpdate(id,{
        price:req.body.price,
        productName:req.body.productName,
        category:req.body.category,
        brand:req.body.brand,
        stock:req.body.stock,
        specifications:req.body.specifications

        })
        const imgs = req.files.map( f=> ({ url: f.path,filename: f.filename}))
        product.images.push(...imgs)
        await product.save();
        
        if(req.body.deleteImages){
            await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}})
        }
        
        req.flash('success','Product Updated')
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}
//show products

const showProducts = async(req,res)=>{
    try {
        const category = await categerySchema.find()
        const all_products = await productSchema.find().populate("category brand")
        res.render('showProducts',{all_products,category})
    } catch (error) {
        console.log(error)
    }
}
// block product
const blockProduct = async(req,res)=>{
    try {
        const {id} = req.params
        await productSchema.findByIdAndUpdate(id,{is_blocked:true})
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}
// unblock product
const unblockProduct = async(req,res)=>{
    try {
        const {id} = req.params
        await productSchema.findByIdAndUpdate(id,{is_blocked:false})
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getAddProduct,
    postAddProduct,
    updateProduct,
    getUpdateproduct,
    showProducts,
    blockProduct,
    unblockProduct

}