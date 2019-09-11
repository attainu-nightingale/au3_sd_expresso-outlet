
//  ==============================MENU SCROLLING WITH ACTIVE ITEM SELECTED

    
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
      })
  
      // =============================================================
     
      function show_alert() {
         alert("Thank you for contacting with Us");
       }

     
         // $(function() {
      //     $("send_email").click(function(){
      //        $("divpopup").dialog({
      //          title:"Mail Sent",
      //          width:400,
      //          hight:200,
      //          modal:true,
      //          buttons:{
      //            close:
      //              function(){
      //                $(this).dialog("close");
      //              }
                 
      //          }
                 
      //        });
      //     });
      // });

