$( document ).ready(function() {

    $('#menu-list').hide();
    $('.menu-oid').hide();
        
    $('#list-menus').click(() => {
        $('#menu-list').show();
    });
    
    $('#hide-menus').click(() => {
        //e.preventDefault();
        $('#menu-list').hide();
    });

// Add New Order click
$(document).on('click', '#add-menu', function () {
  $('#addmenu-successmsg').hide();
    $.ajax({
          
      url :'/manager/getAllMenus/' ,
      type : 'GET',
      datatype : 'json',
      contentType : 'application/json',
      success : function(data) {
        var newid = data.length + 1;
        $('#menu-no').val(newid);
        console.log(newid);
        $('#menu-no').attr("disabled","true");
      }
    });   
  });  

//Add button click on New Menu Form
$(document).on('click', '#next-btn', function () {
    $('#menu-no').removeAttr("disabled");
    var menuno = $('#menu-no').val();
    var menuname = $('#menu-name').val();
    var menuimg = $('#menu-pic').val();
    $('.form-group').hide();
        $('#addmenu-successmsg').show();
        $('#next-btn').hide();  
});  
//     var newMenu = {
//       menu_no : menuno,
//       menu_name : menuname,
//       menu_pic : menuimg
//     };
//     console.log(newMenu);
//     $.ajax({
          
//       url :'/manager/getAllMenus/',
//       type : 'POST',
//       data: JSON.stringify(newMenu),
//       datatype : 'json',
//       //async : false,
//       contentType : 'application/json',
//       success : function(data) {
//         console.log(data);
//         $('.form-group').hide();
//         $('#addmenu-successmsg').show();
//         $('#next-btn').hide();  
//       }
//     });
//   });  

//Add New button click on Menu page to add new Menu item
$(document).on('click', '#addmenuitem-btn',function () {
  $('#addmenuitem-successmsg').hide();
    var menuname = $('#getName').text();
    console.log(menuname);
    $.ajax({
          
        url :'/manager/getMenu/' + menuname,
        type : 'GET',
        datatype : 'json',
        contentType : 'application/json',
        success : function(data) {
          console.log(data);
          var new_menuno = data[0].menu_items.length + 1;
          $('#menuitem-no').val(new_menuno);
          console.log(new_menuno);
          $('#menuitem-no').attr("disabled","true");
        }
      });   
});  

//Add button click on Add Menu Item form

$(document).on('click', '#add', function () {
  $('#menuitem-no').removeAttr("disabled");
  $('.form-group').hide();
  $('#addmenuitem-successmsg').show();
  $('#add').hide();  
  
  var menuitemno = $('#menuitem-no').val();
  var menuitemname = $('#menuitem-name').val();
  var inventory = $('#inventory').val();
  var price = parseFloat($('#price').val());
  var imgpath = $('#item_pic').val();
  console.log(menuitemno + menuitemname + inventory + price + imgpath);
  // $('#item-box').append (`<tr>
  //                          <td>${menuitemno}</td>
  //                          <td>${menuitemname}</td>
  //                          <td>${price}</td>
  //                          <td>${imgpath}</td>
  //                          </tr>
  //                       `);

                        

});

// Delete Menu click
$(document).on('click', '.delete-btn', function () {
    $('#menudel-successmsg').hide();
    $('#del-footer').hide();
    $('#del-confirm').show();
     $('#confirm-footer').show();
   
    var id = $(this).prev().prev().prev().text();
    console.log('ObjectID of menu is ' + id);
  
    $(document).on('click', '#yes-del', function () {
     $('#del-confirm').hide();
     $('#confirm-footer').hide();
      $.ajax({
            
        url :'/manager/menu-management/menu/' + id,
        type : 'DELETE',
        datatype : 'json',
        success : function(data) {
            console.log(data);
            $('#menudel-successmsg').show();
            $('#del-footer').show();
            console.log(JSON.stringify(data));
        }
    });
  });
  }); 







});      