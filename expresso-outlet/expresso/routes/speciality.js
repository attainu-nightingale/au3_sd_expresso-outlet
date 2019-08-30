var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.render("speciality.hbs",{
        title:"Speciality Page",
        addNavLink:"active"
    })
    
});
module.exports=router;