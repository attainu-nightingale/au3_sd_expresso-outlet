$(document).ready(function(){
$.ajax({
  
    url:"/getAllMenus",
    // url:"https://api.myjson.com/bins/mp8kd",
    type: "GET",
    dataType: "json",
    success: (data) => {
        console.log(data)
        var menuName = "";
       
        for (let i = 0; i < data.length; i++) {
            menuName += `&nbsp;&nbsp;<button type ="button" class ="btn btn-primary btn-menu " id="menu" value="${data[i].menu_name}">${data[i].menu_name}</button>`
        }
         $("#menuName").append(menuName)
    }
 })



 

 $(document).on('click', 'button', function() {
    var btnText = $(this).attr("value")
    console.log(btnText);
    $.ajax({
       
        url:"/getAllMenus",
        // url:"https://api.myjson.com/bins/mp8kd",
        type: "GET",
        dataType: "json",
        success: (data) => {
            //console.log(data)
            $("#pc").empty();
            var index = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i].menu_name == btnText) {
                    index = i;
                }
            }
             console.log(data[index].menu_items)
            
            for (let j =0;j<data[index].menu_items.length;j++){
               

                var menu_item_name =""
                var image_Path =""
                var price =""

                 menu_item_name = `${data[index].menu_items[j].menu_item_name}`
                 image_Path = `${data[index].menu_items[j].image_Path}`
                 price = `${data[index].menu_items[j].price}`

                 var out = '<div class="col-4"><div class="card" id="sub">';
                 out += '<div class="card-header">';
                 out += '<div class="d-flex justify-content-between align-items-center">';
                 out += '<div class="d-flex justify-content-between align-items-center">';
                 out += '<div class="mr-2">';
                 out += '</div>';


                 out += '<div class="ml-2">';
                 out += '<img align="center" class="menupic" src=' + image_Path  + '>';
                 out += '</div>';
                 out += '</div>';
                 out += '</div>';
                 out += '</div>';

                 out += '<div class="card-body">';

                 out += '<a class="card-link" href="#">';
                 out += '<h6 style ="text-align: center" class="card-title">' + menu_item_name + '</h6>';
                 out += '</a>';

                 out += '<p style ="text-align: center"    class="card-text">' + "Rs " + price + '</p>';
                 out += '</div>';

                 out += '</div></div>';


                 $('#pc').append(out);  


            }
            console.log(menu_item_name)
        }
    })
 })


 var name,email,message;
 name    = $("#txtname").val();  
 email   = $("#txtemail").val();   
 message = $("#txtmessage").val();
     
$('#txtname, #txtemail, #txtmessage').bind('keyup', function() {
    $("#message").html("");
    if(name || email || message == ''){
        $('#btnsendemail').attr('disabled','true');
    }
    if(allFilled()) $('#btnsendemail').removeAttr('disabled');
});
    
function allFilled() {
    var filled = true;
    if($('#textmessage').val() == '') filled = false;
    $('body input').each(function() {
        if($(this).val() == '') filled = false;
        
    });
    return filled;
}  

$("#btnsendemail").click(function() { 
    name = $("#txtname").val();  
    email = $("#txtemail").val();   
    message = $("#txtmessage").val();
    console.log(name + email + message);       
    
    
    $.get("/sendmail",  
        {  
            name: name,  
            email: email,    
            message: message  
        },  
    function(data) {  
        $("#message").text("Sending Email please wait ..."); 
    if(data == "sent") {  
        $("#message").html("Message has been sent successfully. Thanks");  
        $("#txtname").val("");
        $("#txtemail").val("");
        $("#txtmessage").val("");
    }  
    }); 
});  



//  ===  MENU SCROLLING WITH ACTIVE ITEM SELECTED  ====

    
var lastId,
topMenu = $(".mu-main-nav"),
topMenuHeight = topMenu.outerHeight()+13,

menuItems = topMenu.find('a[href^=\\#]'),

scrollItems = menuItems.map(function(){
  var item = $($(this).attr("href"));
  if (item.length) { return item; }
});


menuItems.click(function(e){
  var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+25;
  jQuery('html, body').stop().animate({ 
      scrollTop: offsetTop
  }, 1500);           
   jQuery('.navbar-collapse').removeClass('in');  
  e.preventDefault();
});


jQuery(window).scroll(function(){
  
   var fromTop = $(this).scrollTop()+topMenuHeight;
   

   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)
       return this;
   });
 
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;
       
       menuItems
         .parent().removeClass("active")
         .end().filter("[href=\\#"+id+"]").parent().addClass("active");
   }           
});


});
