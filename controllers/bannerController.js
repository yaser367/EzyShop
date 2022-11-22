const Banner = require('../models/bannerSchema')
const Product = require('../models/productSchema')
const {cloudinary} = require('../config/cloudinary')

const showBannerMng = async(req,res)=>{
    try {
        const products = await Product.find({}).sort({createdAt:-1})
        res.render("bannerManagement",{products,title:"banner"})
    } catch (error) {
        console.log(error)
    }
}

const postBannerManagement = async(req,res)=>{
    try {
        const {offerPrice,productId,bannerName,offerName,heading,details} = req.body
        const bannerexist = await Banner.findOne({bannerName:bannerName})
        if(!bannerexist){
            const banner = new Banner({
                bannerName:bannerName,
                productId:productId,
                offerName:offerName,
                heading:heading,
                offerPrice:offerPrice,
                discription:details,
                
            })
            banner.image = req.files.map(f=> ({ url: f.path,filename: f.filename}))
            await banner.save()
            req.flash('success','successfully added')
            res.redirect('back')
            
            
           
        }else{
            const banner = await Banner.updateOne({bannerName:bannerName},{$set:{
                productId:productId,
                offerName:offerName,
                heading:heading,
                offerPrice:offerPrice,
                discription:details,
                image:req.files.map( f=> ({ url: f.path,filename: f.filename}))
            }})
            
            req.flash('success','successfully added')
            res.redirect('back')
           
            
            
        }    
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    showBannerMng,
    postBannerManagement
}