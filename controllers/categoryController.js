const categories = require("../models/categorySchema");

// categery add get rout
const getCategoryPage = async (req, res) => {
  const catData = await categories.find({});
  res.render("showCategory", {catData });
};

// categery add get rout
const getCategory = async (req, res) => {
  res.render("addcategory", { title: "addcategory" });
};

//category add post rout
const addCategory = async (req, res) => {
  try {
    const category_data = await categories.find();
    if (category_data.length > 0) {
      let checking = false;
      for (let i = 0; i < category_data.length; i++) {
        if (
          category_data[i]["category"].toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
      if (checking == true) {
        req.flash("err", "This category already exist");
        res.redirect("back");
      } else {
        const { category } = req.body;

        let cat = categories.findOne({ category });

        if (cat) {
          cat = new categories({
            category,
          });

          cat.save();
          req.flash("success", "successfully added");
          res.redirect("back");
        }
      }
    } else {
      const { category } = req.body;

      let cat = categories.findOne({ category });

      if (cat) {
        cat = new categories({
          category,
        });

        await cat.save();
        req.flash("success", "successfully added");
        res.redirect("back");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getEditCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const catData = await categories.findById({ _id: id });
    if (catData) {
      res.render("editCategory", { title: "editcategory", catData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
  }
};

const postEditCategory = async (req, res) => {
  try {
    const catData = await categories.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          category: req.body.category,
        },
      }
    );
    req.flash("success", "category updated");
    res.redirect("/admin/category/categories");
  } catch (error) {
    console.log(error);
  }
};

//delete category

const deleteCategory = async (req, res) => {
  try {
      const id = req.query.id;
      await categories.deleteOne({_id:id})
      req.flash('success','Item deleted')
      res.redirect('/admin/category/categories')
    
  } catch (error) {
    console.log(error);
  }
};
// block category
const blockCategory = async(req,res)=>{
  try {
      const {id} = req.params
      await categories.findByIdAndUpdate(id,{is_blocked:true})
      res.redirect('back')
  } catch (error) {
      console.log(error)
  }
}
// unblock unblock
const unblockCategory = async(req,res)=>{
  try {
      const {id} = req.params
      await categories.findByIdAndUpdate(id,{is_blocked:false})
      res.redirect('back')
  } catch (error) {
      console.log(error)
  }
}

module.exports = {
  addCategory,
  getCategory,
  getEditCategory,
  postEditCategory,
  deleteCategory,
  getCategoryPage,
  blockCategory,
  unblockCategory
};
