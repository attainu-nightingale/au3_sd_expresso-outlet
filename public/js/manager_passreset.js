$('#message').hide();
$('#save').click(()=> {
    var emp_name = $('#name').text();
    console.log(emp_name);
    var newPasswd =  {
        password : $('#new-password').val()
    } 

    console.log(newPasswd);
    $.ajax({
        
        url :'/manager/my-profile/' + emp_name,
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
