const mongoose = require('mongoose');
const Coupon = require('../models/couponSchema')

const showCouponManage = async(req,res)=>{
    try {
        const coupons = await Coupon.find({}).sort({"createdAt":1})
        res.render('couponManagement',{coupons})

    } catch (error) {
        console.log(error)
    }
}
const addCoupon = async(req,res)=>{
    try {
 
        res.render('addCoupon')

    } catch (error) {
        console.log(error)
    }
}

const postAddCoupon = async(req,res)=>{
    try {
        const {couponCode,couponName,discount,minimum,maximum,expiry} = req.body;
        
        const coupenExist = await Coupon.findOne({couponCode:couponCode})
        if(!couponCode,!couponName,!discount,!minimum,!maximum,!expiry){
            res.send({empty:true})
        }else if(discount.length > 2){
            res.send({percetage:false})
        }else if(coupenExist){
            res.send({exist:true})
        }else{
            const coupon = new Coupon({
                couponCode:couponCode,
                couponName:couponName,
                discount:discount,
                minimumPrice:minimum,
                maxmumPrice:maximum,
                expireDate:expiry
            })
            await coupon.save()
            res.send({success:true})
        }
         
    } catch (error) {
        console.log(error)
    }
}

const changeStatus = async(req,res)=>{
    try {
        const {id} = req.params
        const couponId = mongoose.Types.ObjectId(id)
        const active = await Coupon.findOne({_id:couponId})        
        
        if(active.isActive === true){
            await Coupon.updateOne({_id:couponId},{$set:{isActive:false}})
        }
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addCoupon,
    showCouponManage,
    postAddCoupon,
    changeStatus
}