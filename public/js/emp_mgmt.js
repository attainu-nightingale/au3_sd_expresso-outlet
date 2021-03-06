$( document ).ready(function() {



$('.employee-list').hide();

$('#list-employees').click(() => {
    //e.preventDefault();
    $('.employee-list').show();
  });

  $('#hide-employees').click(() => {
    //e.preventDefault();
    $('.employee-list').hide();
  });

  $(document).on('click', '#add-employee', function () {
    $('#message').hide();
    $.ajax({
        
      url :'/manager/getAllEmployees/' ,
      type : 'GET',
      datatype : 'json',
      contentType : 'application/json',
      success : function(data) {
        var newid = data.length + 1;
        $('#id').val(newid);
        console.log(newid);
        $('#id').attr("disabled","true");

      }
      });    
  });

  $(document).on('click', '#save', function () {
    $('#id').removeAttr("disabled");
    $('.form-group').hide();
    $('#message').show();
    $('#save').hide();
  });
    // var id = $('#id').val();
    // var date = new Date($('#joining_date').val());
    //   day = date.getDate() <10 ? "0" + date.getDate() : date.getDate();
    //   month = (date.getMonth() + 1) <10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    //   year = date.getFullYear();
    //   var joiningdate = [year, month, day].join('/');
    
    // var checkbox = "false";
    // if ($('#is_empofmonth').is(":checked"))
    // {
    //   checkbox = "true";
    // }

    // var is_empofmonth = checkbox;

    // console.log(id + ' ' + joiningdate + ' ' + checkbox);

  //   var newEmp =  {
  //     id : $('#id').val(),
  //     name : $('#name').val(),
  //     age : $('#age').val(),
  //     email : $('#email').val(),
  //     gender : $("input[name='gender']:checked").val(),
  //     address : $('#address').val(),
  //     role : $('#role').val(),
  //     job : $('#job').val(),
  //     username : $('#username').val(),
  //     password : $('#password').val(),
  //     joiningdate : joiningdate,
  //     profilepic : $('#profile_pic').val(),
  //     empofmonth : checkbox
  //    };
  
  // console.log(newEmp);

  
  //console.log(JSON.stringify(data));

   // });
      
  //     $.ajax({
          
  //         url :'/manager/employee-management/employee/',
  //         type : 'POST',
  //         dataType : 'json',
  //         contentType : 'application/json',
  //         data : JSON.stringify(newEmp),
  //         success : function(data) {
  //           $('.form-group').hide();
  //             $('#message').show();
  //             $('#save').hide();
  //             console.log(JSON.stringify(data));
  //         }
  //       });  
  // }); 

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

// Delete Timesheet click
$(document).on('click', '.delete-btn', function () {
  $('#timesheetdel-successmsg').hide();
  $('#del-footer').hide();
  $('#del-confirm').show();
   $('#confirm-footer').show();
  var name = $(this).prev().prev().prev().text();
  $('#for-name').text(name);
  var emp_id = $(this).prev().prev().prev().prev().text();
  console.log(emp_id);

  $(document).on('click', '#yes-del', function () {
   $('#del-confirm').hide();
   $('#confirm-footer').hide();
    $.ajax({
          
      url :'/manager/employee-management/employee/' + emp_id,
      type : 'DELETE',
      datatype : 'json',
      success : function(data) {
          console.log(data);
          $('#timesheetdel-successmsg').show();
          $('#del-footer').show();
          console.log(JSON.stringify(data));
      }
  });
});
}); 

 $(document).on('click', '#timesheets-btn', function (e) {
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
                 <a href="#" class="btn btn-success" id="add-timesheet" data-toggle="modal" data-target="#add-timesheetModal">Add New Timesheet</a>
                 <button class="btn btn-warning" id="hide-timesheets">Hide</button><br/><br/>
                <div class="card-deck" id="timesheet-box"></div>`);

          for(i=0;i<data.length;i++){
            $('#timesheet-box').append(`<div class="card col-4 d-inline-block" style="min-width:25%;max-width:30%;padding-top:20px;margin-top:10px;">
            <div class="card-body shadow-lg p-3 mb-5 rounded bg-white">
                <h6 class="card-title text-center">${data[i].date}</h6>
                <p class="card-text text-center">

                    Working Hours : ${data[i].working_hours}<br/>
                    Wage Per Hour : ${data[i].wage_per_hr}<br/>
                    Total Wage : ${data[i].total_wage}<br/>
                </p>
                <div class="d-flex justify-content-center">
                <a href="#" class="edit-timesheet btn btn-md btn-info" data-toggle="modal" data-target="#edit-timesheetModal">Edit</a>
                <a href="#" class="del-timesheet btn btn-md btn-danger" data-toggle="modal" data-target="#del-timesheetModal">Delete</a><br/>
                </div>
                </div>
            
        </div>
             `);
          }
        }
        });
        });

  //Add New Timesheet button click
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

 $('#update-working-hrs, #update-wage-per-hr').on('input', function() {
  var x = parseFloat($('#update-working-hrs').val());
  var y = parseFloat($('#update-wage-per-hr').val());
  var z = x * y;
  console.log(z);
  $("#update-total-wage").val(z.toFixed(2));
});

//Save New added timesheet button click
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

    $(document).on('click', '#hide-timesheets', function () {
      //e.preventDefault();
      $('#result-box').html("");
    });

    // Edit Timesheet click
    $(document).on('click', '.edit-timesheet', function () {
      $('#timesheetupdate-successmsg').hide();
      
      var name = $('#forname').text();
      console.log(name);
      $('#for-empname').text(name);

      //var date = $(this).prev().prev().text();
      var date = $(this).parent().prev().prev().text();
      console.log(date);
      $('#update-date').val(date);
      $('#update-date').attr("disabled","true");
    });

    // Save Updated Timesheet click
    $(document).on('click', '#saveupdated-timesheet', function () {
      var form = $('#edittimesheet');
      var emp_id = $('#forid').text();
      $('#update-date').removeAttr("disabled");
      console.log($('#update-date').val());

 
    var timesheetUpdate =  {
        date : $('#update-date').val(),
        workinghours : $('#update-working-hrs').val(),
        wageperhr : $('#update-wage-per-hr').val(),
        totalwage : $('#update-total-wage').val()
       };

    console.log(timesheetUpdate); 

        $.ajax({
            
            url :'/manager/employee/timesheets/' + emp_id,
            type : 'PUT',
            datatype : 'json',
            data: JSON.stringify(timesheetUpdate),
            contentType : 'application/json',
            success : function(data) {
              $('.form-group').hide();
            $('#timesheetupdate-successmsg').show();
            $('#saveupdated-timesheet').hide();
            console.log(JSON.stringify(data));
            }
          });  
    });

// Delete Timesheet click
$(document).on('click', '.del-timesheet', function () {
  
  $('#timesheetdel-successmsg').hide();
  $('#del-footer').hide();
  var name = $('#forname').text();
  $('#for-name').text(name);
  var emp_id = $('#forid').text();
  var date = $(this).parent().prev().prev().text();
  console.log(emp_id + ' ' + date);

  $(document).on('click', '#yes-del', function () {
   $('#del-confirm').hide();
   $('#confirm-footer').hide();
    $.ajax({
          
      url :'/manager/employee/timesheets/' + emp_id + '/' + date,
      type : 'DELETE',
      datatype : 'json',
      success : function(data) {
          console.log(data);
          $('#timesheetdel-successmsg').show();
          $('#del-footer').show();
          console.log(JSON.stringify(data));
      }
  });
});
});






});
