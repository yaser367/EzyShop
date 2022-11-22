const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true,'name is required'],
    minlength:[3,'name can\'t be smaller than 3 charcter']
  },
  email: {
    type: String,
    require: [true,'email is required'],
    lowercase:true,
    index:true,
    
  },
  mobile: {
    type: String,
    require: [true,'password required'],
    minlength:[10,'mobile number must be 10 numbers'],
    maxlength:[10,'mobile number must be 10 numbers']
  },
  password: {
    type: String,
    require: true,
    minlength:[3,'password can\'t be smaller than 3 charcter'],
  },
  is_admin: {
    type: Boolean,
    require: true,
  },
  is_verified: {
    type: Boolean,
    require: true,
  },
  is_active: {
    type: Boolean,
    require: true,
  },
  address:[
    {
      fistName:{
        type:String,
        require:true
      },
      surName:{
        type:String,
        require:true
      },
      phone:{
        type:String,
        require:true
      },
      address:{
        type:String,
        require:true
      },
      postCode:{
        type:String,
        require:true
      },
      area:{
        type:String,
        require:true
      },
      emailId:{
        type:String,
        require:true
      },
      country:{
        type:String,
        require:true
      },
      state:{
        type:String,
        require:true
      }  
    }
  ]
  
});

module.exports = mongoose.model("User", userSchema);
