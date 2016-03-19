$(document).ready(function(){
  console.log('this works');
  $('#taskForm').on('submit', postTasks);
});

function postTasks(event) {
  event.preventDefault();

  console.log('made it into postTasks function');
  var formData = {};
  console.log('form data: ', formData);

  var formArray = $('#taskForm').serializeArray();
  $.each(formArray, function (index, element) {
    formData[element.name] = element.value;
  });

  $.ajax({
    type: 'POST',
    url: '/todo',
    data: formData,
    success: getChores
  });
  $('#taskForm').trigger('reset');
}

function getChores() {
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: choresAppendDom
  });
}

function choresAppendDom (choresArray) {
  console.log('inside appenddom after GET call', choresArray);
  for (var i = 0; i < choresArray.length; i++) {
    $('.displayTasks').append('<li>' + choresArray[i].chore + '</li>')
  }
}
