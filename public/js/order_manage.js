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