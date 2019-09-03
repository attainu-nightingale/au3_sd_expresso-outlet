$( document ).ready(function() {

$('#message').hide();

$('.employee-list').hide();

$('#list-employees').click(() => {
    //e.preventDefault();
    $('.employee-list').show();
  });

  $('#hide-employees').click(() => {
    //e.preventDefault();
    $('.employee-list').hide();
  });

//   $(document).on('click', '.view-btn', function () {
//     $('#empdetails-box').html("");
//     var emp_id = $(this).prev().prev().prev().text();
//     console.log(emp_id);

//     $.ajax({
        
//         url :'/manager/employee/' + emp_id,
//         type : 'GET',
//         datatype : 'json',
//         contentType : 'application/json',
//         success : function(data) {
//           console.log(data);
//            $('#empdetails-box').append(`Name : ${data[0].emp_name}<br/>
//                                         Age : ${data[0].emp_age}<br/>
//                                         Email : ${data[0].email}<br/>
//                                         Gender : ${data[0].emp_gender}<br/>
//                                         Address : ${data[0].emp_addr}<br/>
//                                         Role : ${data[0].emp_role}<br/>
//                                         Job : ${data[0].job}<br/>
//                                         Username : ${data[0].username}<br/>
//                                         Joining Date : ${data[0].joining_date}<br/>
//                                         Employee Of the Month : ${data[0].is_employee_of_month}<br/>`);
        
//           $('.view-close').click(() => {
//             $('#empdetails-box').html("");
//           })

//     }
//   });
// }); 

$(document).on('click', '.edit-btn', function () {
  $('#update-successmsg').hide();
  var emp_id = $('#forid').text();
  console.log(emp_id);
    
    $.ajax({
        
        url :'/manager/employee-management/employee/' + emp_id,
        type : 'GET',
        datatype : 'json',
        contentType : 'application/json',
        success : function(data) {
      
          $('#update-name').val($('#forname').text());
          $('#update-age').val($('#forage').text()); 
          $('#update-email').val($('#foremail').text());
          $('#update-address').val($('#foraddr').text());
          $('#update-job').val($('#forjob').text());
          $('#update-username').val($('#forusername').text());
          $('#update-empofmonth').prop('selected' , $('#forempofmon').text());
        }
      });  
});

$(document).on('click', '#update-save', function () {
  var emp_id = $('#forid').text();
  console.log(emp_id);

  var newUpdate =  {
    name : $('#update-name').val(),
    age : $('#update-age').val(),
    email : $('#update-email').val(),
    address : $('#update-address').val(),
    job : $('#update-job').val(),
    username : $('#update-username').val(),
    empofmonth : $('#update-empofmonth').val()
   };

console.log(newUpdate);
    
    $.ajax({
        
        url :'/manager/employee-management/employee/' + emp_id,
        type : 'PUT',
        dataType : 'json',
        contentType : 'application/json',
        data : JSON.stringify(newUpdate),
        success : function(data) {
          $('.form-group').hide();
            $('#update-successmsg').show();
            $('#update-save').hide();
            console.log(JSON.stringify(data));
        }
      });  
});


});