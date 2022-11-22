const brandSchema = require("../models/brandSchema");

//get show brands
const getShowBrands = async(req,res)=>{
  try {
    const brand = await brandSchema.find()
    res.render("brandShow",{brand})
  } catch (error) {
    console.log(error)
  }
}

const getCreateBrand = async (req, res) => {
  try {
    res.render("createBrand", { title: "brandCreate" });
  } catch (error) {
    console.log(error);
  }
};

const postCreateBrand = async (req, res) => {
  try {
    const brands = await brandSchema.find();
    if (brands.length > 0) {
      let checking = false;
      for (let i = 0; i < brands.length; i++) {
        if (
          brands[i]["brandName"].toLowerCase() ===
          req.body.brand.toLowerCase()
          ) {
          checking = true;
          break;
        }
      }
      if (checking == true) {
        req.flash("err", "This brand already exist");
        res.redirect("back");
      } else {
        const { brand } = req.body;
        let brand_data = brandSchema.find({ brand });
        if (brand_data) {
          brand_data = new brandSchema({
            brandName:brand,
          });
          await brand_data.save();
          req.flash("success", "successfully added");
          res.redirect("back");
        }
      }
    } else {
      const { brand } = req.body;
      let brand_data = brandSchema.findOne({ brand });
      if (brand_data) {
        brand_data = new brandSchema({
          brandName:brand,
        });
        await brand_data.save();
        req.flash("success", "successfully added");
        res.redirect("back");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// delete brand

const deleteBrand = async(req,res)=>{
  const {id} = req.params
  await brandSchema.findByIdAndDelete(id)
  req.flash('success','Deleted Successfully')
  res.redirect('back')
}
// block category
const blockBrand = async(req,res)=>{
  try {
      const {id} = req.params
      await brandSchema.findByIdAndUpdate(id,{is_blocked:true})
      res.redirect('back')
  } catch (error) {
      console.log(error)
  }
}
// unblock unblock
const unblockBrand = async(req,res)=>{
  try {
      const {id} = req.params
      await brandSchema.findByIdAndUpdate(id,{is_blocked:false})
      res.redirect('back')
  } catch (error) {
      console.log(error)
  }
}
module.exports = {
  getCreateBrand,
  postCreateBrand,
  getShowBrands,
  deleteBrand,
  blockBrand,
  unblockBrand
};
