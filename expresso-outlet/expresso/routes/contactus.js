var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.render("contactus.hbs",{
        title:"Contact Us Page",
        addNavLink:"active"
    })
    
});
module.exports=router;