const User = require("../models/userSchema");
const Order = require('../models/checkoutSchema')
const bcrypt = require('bcrypt')
const categories = require("../models/categorySchema");

// get admin lognin page

const getAdminDashboards = async (req, res) => {
  
  const graph = await Order.aggregate(
    [{
        $group: {
            _id: {
                month: {
                    $month: "$createdAt"
                },
                year: {
                    $year: "$createdAt"
                }
            },
            totalPrice: {$sum: '$total_price'},
            count: { $sum: 1}

        }

    }, {
        $project: {
            totalPrice: 1,
            _id: 1
        }
    }, {
        $sort: {
            _id: -1
        }
    }, {
        $limit: 6
    }]
);
let values = [];
let revenue = [];
let graphlabels = [];
let month = []
let year = []
graph.forEach((g) => {
    graphlabels.push(g._id);
    values.push(g.totalPrice)
    revenue.push(g.totalPrice * 10 / 100)
    month.push(g._id.month)
    year.push(g._id.year)
})

const graphlab = JSON.stringify(graph)

const dailySale = await Order.find({ $and: [{ createdAt: { $lt: Date.now(), $gt: Date.now() - 86400000 } }, { 'orderStatus.type': { $ne: 'Cancelled' } }] })
let todaySale = 0
dailySale.forEach((s) => {
    todaySale += s.total_price
})
let totalSale = 0


const sale = await Order.find({ 'orderStatus.type': { $ne: 'Cancelled' } })
sale.forEach((s) => {
    totalSale += s.total_price
})
  const cat = await categories.find()
  const category = cat.category
  const users = await User.find()
  const orders = await Order.find()
  const ordered = await Order.find({orderStatus:"ordered"})
  const shipped = await Order.find({orderStatus:"Shipped"})
  const cancelled = await Order.find({orderStatus:"cancelled"})
  const packed = await Order.find({orderStatus:"packed"})
  const delivered = await Order.find({orderStatus:"delivered"})

  res.render("adminDash",{users,orders,ordered,shipped,cancelled,packed,delivered,graphlab,values,month,year,todaySale,totalSale});
};
// get admin lognin page

const getAdminLogin = async (req, res) => {
  res.render("adminlogin", { title: "admin_login" });
};

// post admin lognin page

const postAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        if (user.is_admin === 0) {
        } else {
          req.session.isAdd = true;

          res.redirect("/admin/dash");
        }
      } else {
        res.render("login", { message: "Email and posword is incorrect" });
      }
    } else {
      res.render("login", { message: "Email and posword is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};



//post admin logout

const adminLogout = async (req,res) =>{
    try {
        delete req.session.isAdd;
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error);
    }
}

// show users

const showUser = async(req,res)=>{
  try {
    const users = await User.find({is_admin:false})
    res.render('userManagement',{users})
  } catch (error) {
    console.log(error)
  }
}
const editUserStatus = async(req,res)=>{
  try {
    const {id} = req.params;
    const users = await User.findByIdAndUpdate(id,{$set:{is_active:false}})
    res.redirect('back')
  } catch (error) {
    console.log(error)
  }
}
const editUserStatusUnblock = async(req,res)=>{
  try {
    const {id} = req.params;
    const users = await User.findByIdAndUpdate(id,{$set:{is_active:true}})
    res.redirect('back')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAdminLogin,
  postAdminLogin,
  adminLogout,
  showUser,
  getAdminDashboards,
  editUserStatus,
  editUserStatusUnblock
  
};
