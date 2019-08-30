var express=require("express");
var router=express.Router();

router.get("/",function(req,res){
    res.render("aboutus.hbs",{
        title:"About Us Page",
        addNavLink:"active"
    })
    
});
module.exports=router;