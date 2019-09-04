$('#message').hide();
$('#save').click(()=> {
    var emp_id = $('#id').text();
    console.log(emp_id);
    var newPasswd =  {
        password : $('#new-password').val()
    } 

    console.log(newPasswd);
    $.ajax({
        
        url :'/employee/my-profile/' + emp_id,
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
