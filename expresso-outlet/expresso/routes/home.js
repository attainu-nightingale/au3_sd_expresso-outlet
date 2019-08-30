
var express=require("express");
var router=express.Router();


// =============================================================

router.get("/home",function(req,res){
    res.render("home.hbs",{
        title:"Home Page",
        addNavLink:"active"
    })
    
});
module.exports=router;