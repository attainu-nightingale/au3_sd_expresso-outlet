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


$(document).on('click', '#edit-btn', function () {
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
          $('#update-password').val($('#forpassword').text());
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
    password : $('#update-password').val(),
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

 $(document).on('click', '#timesheets-btn', function (e) {
  //$('#update-successmsg').hide();
  e.preventDefault();
  $('#result-box').html("");
  var emp_id = $('#forid').text();
  console.log(emp_id);
    
    $.ajax({
        
        url :'/manager/employee/timesheets/' + emp_id,
        type : 'GET',
        dataType : 'json',
        contentType : 'application/json',
        success : function(data) {
          console.log(data);
          $('#result-box').append(`<h5 class="display-6 text-white">Employee Timesheets</h5><br/>
                 <a href="#" class="btn btn-success" id="add-timesheet" data-toggle="modal" data-target="#add-timesheetModal">Add New Timesheet</a><br/><br/>
                <div class="card-deck" id="timesheet-box"></div>`);

          for(i=0;i<data.length;i++){
            $('#timesheet-box').append(`<div class="card col-4" style="width: 18rem;">
            <div class="card-body shadow-lg p-3 mb-5 rounded bg-white">
                <h6 class="card-title text-center">${data[i].date}</h6>
                <p class="card-text">

                    Working Hours : ${data[i].working_hours}<br/>
                    Wage Per Hour : ${data[i].wage_per_hr}<br/>
                    Total Wage : ${data[i].total_wage}<br/>
                </p>
                <a href="#" class="edit-timesheet btn btn-md btn-info">Edit</a>
                <a href="#" class="del-timesheet btn btn-md btn-danger">Delete</a><br/>
            </div>
            
        </div>
             `);
          }
        }
        });
        });

  $(document).on('click', '#add-timesheet', function () {
    $('#timesheetadd-successmsg').hide();
    var empid = $('#forid').text();
    console.log(empid);
    $('#emp-id').val(empid);
    $('#emp-id').attr("disabled","true");
    var empname = $('#forname').text();
    console.log(empname);
    $('#emp-name').val(empname);
    $('#emp-name').attr("disabled","true");
  });


  $('#working-hrs, #wage-per-hr').on('input', function() {
    var x = parseFloat($('#working-hrs').val());
    var y = parseFloat($('#wage-per-hr').val());
    var z = x * y;
    console.log(z);
    $("#total-wage").val(z.toFixed(2));
 });

  $(document).on('click', '#save-timesheet', function (e) {
    e.preventDefault();
    

    var form = $('#addtimesheet');
    $('#emp-id').removeAttr("disabled");
    $('#emp-name').removeAttr("disabled");
    
    $.ajax({
        
        url :'/manager/employee/timesheets/',
        type : 'POST',
        data: form.serialize(),
        datatype : 'json',
        success : function(data) {
          console.log(data);
          $('.form-group').hide();
            $('#timesheetadd-successmsg').show();
            $('#save-timesheet').hide();
            console.log(JSON.stringify(data));

        }
      });
    }); 

});