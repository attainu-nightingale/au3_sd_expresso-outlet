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

});