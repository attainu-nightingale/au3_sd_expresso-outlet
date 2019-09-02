$('#message').hide();
$('#save').click(()=> {
    var emp_name = $('#name').html();
    console.log(emp_name);
    var newPasswd =  {
        password : $('#new-password').val()
    } 
    //var newPasswd = $('#new-password').val();
    console.log(newPasswd);
    $.ajax({
        
        url :'/employee/my-profile/' + emp_name,
        type : 'PUT',
        datatype : 'json',
        contentType : 'application/json',
        data : JSON.stringify(newPasswd),
        success : function(data) {
            $('.form-group').hide();
            $('#message').show();
            $('#save').hide();
            console.log(JSON.stringify(data));
        }
    }); 
});
