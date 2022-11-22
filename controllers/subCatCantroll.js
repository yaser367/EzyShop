// const subCategories = require("../models/subCategorySchema");
// const categories = require("../models/categorySchema");

// const getShowSubCategory = async(req,res)=>{
//     try {
//         const catData = await subCategories.find({}).populate("Category",{category:1})
//         console.log(catData)
//         res.render('showSubcategory',{title:"showsubcategory",catData})
//     } catch (error) {
//         console.log(error)
//     }
// }

// const getCreateSubCategory = async (req, res) => {
//   try {
//     const catData = await categories.find({})
//     console.log(catData)
//     res.render("addSubcategory", { title: "addSubCategory", catData });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const postSubcategory = async (req, res) => {
//   try {
//     const check_sub = await subCategories.find({
//       categoryId: req.body.categoryId,
//     })
//     if (check_sub.length > 0) {
//       let checking = false;
//       for (let i = 0; i < check_sub.length; i++) {
//         if (
//           check_sub[i]["subCategory"].toLowerCase() ===
//           req.body.subCategory.toLowerCase()
//         ) {
//           checking = true;
//           break;
//         }
//       }
//       if (checking === true) {
//         req.flash("err", "this sub category already exist");
//         res.redirect("/admin/SubCategory/add");
//       } else {
//         const {subCategory} = req.body;
//         let subCat = await subCategories.find({})
        
//         if (subCat) {
//           subCat = new subCategories({
//           categoryId: req.body.categoryId,
//           subCategory: subCategory,
//         });

//         await subCat.save();
//         req.flash("success", "successfully added");
//         res.redirect("/admin/subCategory/add");
//         }
//         }
        
//       }
//     else {
//       const {subCategory} = req.body;
//       let subCat = await subCategories.find({ subCategory: subCategories });
//       if (subCat) {
//         subCat = new subCategories({
//           categoryId: req.body.categoryId,
//           subCategory: subCategory,
//         });
//       }

//       await subCat.save();
//       req.flash("success", "successfully added");
//       res.redirect("/admin/subCategory/add");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = {
//   getCreateSubCategory,
//   postSubcategory,
//   getShowSubCategory
// };
