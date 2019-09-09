$( document ).ready(function() {

$('#order-list').hide();
$('.order-oid').hide();
    
$('#list-orders').click(() => {
    $('#order-list').show();
});

$('#hide-orders').click(() => {
    //e.preventDefault();
    $('#order-list').hide();
  });

// Add New Order click
$(document).on('click', '#add-order', function () {
  $.ajax({
        
    url :'/manager/getAllOrders/' ,
    type : 'GET',
    datatype : 'json',
    contentType : 'application/json',
    success : function(data) {
      var newid = data.length + 1;
      $('#order-id').val(newid);
      console.log(newid);
      $('#order-id').attr("disabled","true");
    }
  });   
});  

//Next button click on New Order Form
$(document).on('click', '#next-btn', function () {
  $('#order-id').removeAttr("disabled");
  var orderid = $('#order-id').val();
  var tableno = $('#table-no').val();
  $('#orderno').text(orderid);
  var newOrder = {
    order_id : orderid,
    table_no : tableno
  };
  console.log(newOrder);
  $.ajax({
        
    url :'/manager/getAllOrders/',
    type : 'POST',
    data: JSON.stringify(newOrder),
    datatype : 'json',
    contentType : 'application/json',
    success : function(data) {
      console.log(data);
    }
  });
});  

$('#menu-item').on('focus', function() {
  $('#menu-item').val("");
  $('#addstock-successmsg').hide();
});


// Input field value change for menu-item will autocalculate the price. Total price is also autocalculated if quantity field input is present
$('#menu-item').on('change', function() {
  var menuitem = $('#menu-item').val();
  var price;
  $.ajax({
        
    url   :'/manager/getMenuItem/' + menuitem,
    type  : 'GET',
    datatype : 'json',
    success : function(data) {
        
        for(i=0;i<data[0].menu_items.length;i++) {
            if(data[0].menu_items[i].menu_item_name == menuitem) {
            console.log(menuitem);
                price = data[0].menu_items[i].price;
             console.log(price);  
            }  
        }
        $('#price').val(price); 
        $('#price').attr("disabled","true");
        var x = parseFloat($('#price').val());
        var y = parseFloat($('#quantity').val());
        var z = x * y;
        console.log(z);
        $("#total-price").val(z.toFixed(2));
    }
  });  
}); 

//Input field value change for price and quantity to calculate totalprice
$('#price,#quantity').on('input', function() {
  
  //$('#price').removeAttr("disabled");
  var x = parseFloat($('#price').val());
  var y = parseFloat($('#quantity').val());
  var z = x * y;
  console.log(z);
  $("#total-price").val(z.toFixed(2));
});

//Add button click on Add Order Item
var grandtotal = 0;
$(document).on('click', '#add', function () {
  var orderitem = $('#menu-item').val();
  var price = parseFloat($('#price').val());
  var quantity = parseFloat($('#quantity').val());
  var totalprice = parseFloat($("#total-price").val());
  
    grandtotal = grandtotal + totalprice;
    console.log('GT:' + grandtotal);

  $('#order-box').append (`<tr>
                           <td class="getOrderItem">${orderitem}</td>
                           <td>${price}</td>
                           <td>${quantity}</td>
                           <td>${totalprice}</td>
                           </tr>
                        `);
  
  $('#grand-total').text(grandtotal.toFixed(2));
  $('#addstock-successmsg').show();
  $.ajax({
        
    url :'/manager/getAllOrders/',
    type : 'GET',
    datatype : 'json',
    contentType : 'application/json',
    success : function(data) {

      console.log(data[data.length-1]);
      orderoid = data[data.length-1]._id;
      console.log(orderoid);

      var newOrderItem = {
        order_item : orderitem,
        price : price,
        quantity : quantity,
        total_price : totalprice,
        grand_total : parseFloat($('#grand-total').text())
      };

  

      $.ajax({
            
        url :'/manager/order-management/order/' + orderoid,
        type : 'POST',
        data: JSON.stringify(newOrderItem),
        datatype : 'json',
        contentType : 'application/json',
        success : function(data) {
            console.log(data);

    }
  });
}
}); 

var stock,menuitem_oid,menu_oid;

  $.ajax({
        
    url   :'/manager/getMenuItem/' + orderitem,
    type  : 'GET',
    datatype : 'json',
    success : function(data) {
        
        for(i=0;i<data[0].menu_items.length;i++) {
            if(data[0].menu_items[i].menu_item_name == orderitem) {
            console.log(orderitem);
            stock = data[0].menu_items[i].in_inventory - quantity;
            menuitem_oid = data[0].menu_items[i]._id;
            menu_oid = data[0]._id;
             console.log('New stock' + stock);  
            }  
        }

        var newInventory =  {
          newQuantity : stock,
          menuitem_oid : menuitem_oid,
          menu_oid : menu_oid
          
      };
      console.log(stock + ' ' + menuitem_oid + ' ' + menu_oid);
        
        $.ajax({
        
          url   :'/manager/getMenuItem/' + orderitem,
          type  : 'PUT',
          datatype : 'json',
          contentType: 'application/json',
          data: JSON.stringify(newInventory),
          success : function(data) {
            console.log(JSON.stringify(data));
            }
        });  
      }
    });  
});

// Delete OrderItem click
$(document).on('click', '.delorderitem', function () {
  var orderitem = $(this).parent().prev().prev().prev().prev().text();
  var quantity = $(this).parent().prev().prev().text();
  var totalprice = $(this).parent().prev().text();
  var orderoid,orderitemoid;
  console.log('Order item' + orderitem + ' ' + 'Quantity' + quantity);
  $('#orderdel-successmsg').hide();
  $('#del-footer').hide();
  $('#del-confirm').show();
  $('#confirm-footer').show();

  $.ajax({
        
    url :'/manager/getAllOrders/',
    type : 'GET',
    datatype : 'json',
    contentType : 'application/json',
    success : function(data) {

      console.log(data[data.length-1]);
      orderoid = data[data.length-1]._id;
      console.log('Order ID' +orderoid);

      for(i=0;i<data[data.length-1].orderedItems.length;i++) {
        if(data[data.length-1].orderedItems[i].item_name == orderitem){
      orderitemoid = data[data.length-1].orderedItems[i]._id;
      newgrand_total = data[data.length-1].grand_total - parseFloat(totalprice); 
        }
      }
      console.log('Order Item ID' + orderitemoid);


  $(document).on('click', '#yes-del', function () {
   $('#del-confirm').hide();
   $('#confirm-footer').hide();
   
    $.ajax({
          
      url :'/manager/order-management/order/' + orderoid + '/' + orderitem,
      type : 'DELETE',
      datatype : 'json',
      success : function(data) {
          console.log(data);
          $('#orderdel-successmsg').show();
          $('#del-footer').show();
          console.log(JSON.stringify(data));
      }
  });

  var stock,menuitem_oid,menu_oid;

  $.ajax({
        
    url   :'/manager/getMenuItem/' + orderitem,
    type  : 'GET',
    datatype : 'json',
    success : function(data) {
        
        for(i=0;i<data[0].menu_items.length;i++) {
            if(data[0].menu_items[i].menu_item_name == orderitem) {
            console.log(orderitem);
            stock = data[0].menu_items[i].in_inventory + parseInt(quantity);
            menuitem_oid = data[0].menu_items[i]._id;
            menu_oid = data[0]._id;
             console.log('New stock' + stock);  
            }  
        }

        var newInventory =  {
          newQuantity : stock,
          menuitem_oid : menuitem_oid,
          menu_oid : menu_oid
          
      };
      console.log(stock + ' ' + menuitem_oid + ' ' + menu_oid);
        
        $.ajax({
        
          url   :'/manager/getMenuItem/' + orderitem,
          type  : 'PUT',
          datatype : 'json',
          contentType: 'application/json',
          data: JSON.stringify(newInventory),
          success : function(data) {
            console.log(JSON.stringify(data));
            }
        });  
      }
    });

    var newGrandTotal =  {
      grand_total : newgrand_total   
  };
  console.log(newGrandTotal);
    
    $.ajax({
    
      url   :'/manager/order-management/order/' + orderoid,
      type  : 'PUT',
      datatype : 'json',
      contentType: 'application/json',
      data: JSON.stringify(newGrandTotal),
      success : function(data) {
        console.log(JSON.stringify(data));
        }
    });  


   });
  }
 }); 
});


// Delete Order click
$(document).on('click', '.delete-btn', function () {
    $('#orderdel-successmsg').hide();
    $('#del-footer').hide();
    $('#del-confirm').show();
     $('#confirm-footer').show();
   
    var id = $(this).prev().prev().prev().prev().prev().prev().text();
    console.log('ObjectID of order is ' + id);
  
    $(document).on('click', '#yes-del', function () {
     $('#del-confirm').hide();
     $('#confirm-footer').hide();
      $.ajax({
            
        url :'/manager/order-management/order/' + id,
        type : 'DELETE',
        datatype : 'json',
        success : function(data) {
            console.log(data);
            $('#orderdel-successmsg').show();
            $('#del-footer').show();
            console.log(JSON.stringify(data));
        }
    });
  });
  }); 


});   