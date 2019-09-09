//$('#for-addstock').hide();

$('#hide-stock').click(() => {
    //e.preventDefault();
    $('#for-addstock').hide();
  });

$(document).on('click', '#submit', function () {
    $('#search-result').html("");
    var menuitem = $("#userinput").val();
    
    $.ajax({
        
        url   :'/manager/getMenuItem/' + menuitem,
        type  : 'GET',
        datatype : 'json',
        success : function(data) {
            
            for(i=0;i<data[0].menu_items.length;i++) {
                if(data[0].menu_items[i].menu_item_name == menuitem)
                    $('#search-result').append(`<p>Stock in inventory : <span class="text-danger"><strong>${data[0].menu_items[i].in_inventory}</strong></span></p>`);
            }
        }
    });      
});  

$(document).on('click', '#needed-stock', function(e) {
    e.preventDefault();
    $('#for-addstock').html("");
    $('#for-addstock').append(`
    <table class="table table-dark table-striped table-hover">
                <tbody id="append-result">
                    <tr>
                        <th class="text-warning text-center">Menu</td>
                        <th class="text-warning text-center">Menu Item Name</td>
                        <th class="text-warning text-center">Inventory Count</td>
                    </tr>
                </tbody>
            </table>`)
    $.ajax({
        
        url   :'/manager/getAllMenus/' ,
        type  : 'GET',
        datatype : 'json',
        contentType: 'application/json',
        success : function(data) {
            for(i=0;i<data.length;i++){
                for(j=0;j<data[i].menu_items.length;j++){
                    if(data[i].menu_items[j].in_inventory < 10){
                        $('#append-result').append(`
                        <tr>
                            <td class="text-white text-center">${data[i].menu_name}</td>
                            <td class="text-white text-center">${data[i].menu_items[j].menu_item_name}</td>
                            <td class="text-white text-center">${data[i].menu_items[j].in_inventory}</td>
                    </tr>
                        
                        `);
                    }
                }
            }
        }
        });
});    

$(document).on('click', '#add-stock', function () {
    $('#addstock-successmsg').hide();
});

$(document).on('click', '#add', function() {
    
    var menuitem = $("#menu-item").val();
    var quantity = parseInt($("#quantity").val());
    console.log(menuitem + ' ' + quantity);
    
    var menuitem_oid, menu_oid;
    $.ajax({
        
        url   :'/manager/getMenuItem/' + menuitem,
        type  : 'GET',
        datatype : 'json',
        success : function(data) {
            
            for(i=0;i<data[0].menu_items.length;i++) {
                if(data[0].menu_items[i].menu_item_name == menuitem){
                 menuitem_oid = data[0].menu_items[i]._id;
                 menu_oid = data[0]._id;
                quantity = parseInt(data[0].menu_items[i].in_inventory) + quantity;
                }}
                var newInventory =  {
                    newQuantity : quantity,
                    menuitem_oid : menuitem_oid,
                    menu_oid : menu_oid
                    
                };
                console.log(quantity + ' ' + menuitem_oid + ' ' + menu_oid);

                        $.ajax({
                    
                            url   :'/manager/getMenuItem/' + menuitem,
                            type  : 'PUT',
                            datatype : 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(newInventory),
                            success : function(data) {
                                $('.form-group').hide();
                                $('#addstock-successmsg').show();
                                $('#add').hide();
                                console.log(JSON.stringify(data));
                            }    
            
     });
        }
    });     
});  
 
