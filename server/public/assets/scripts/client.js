$(document).ready(function(){
  console.log('this works');
  $('#taskForm').on('submit', postTasks);
  $('#taskForm').find('input[type=text]').val('');
  getChores();
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

//this appends the chore and delete button to the DOM. the delete button only affects its particular chore
//now figure out a way to make the delete button an id to also change the DB
function choresAppendDom (choresArray) {
  console.log('inside appenddom after GET call', choresArray);

  //empty tasks for when new submits are entered. this allows the formdata to not be displayed more than once.
  $('.tasks').remove();
  for (var i = 0; i < choresArray.length; i++) {
    $('.displayTasks').append('<div class = "tasks"></div>');
    var $el = $('.displayTasks').children().last();
    $el.append('<li>' + choresArray[i].chore + '</li>');
    $el.append('<button class = "delete">X</button>');
    $el.append('<button class = "complete">✓</button>');
  }

  $('.displayTasks').on('click', '.delete', deleteChore);

  $('.displayTasks').on('click', '.complete', completeChore);

  function deleteChore () {
    $(this).parent().remove();
  }

  function completeChore (){
    $(this).parent().css('background-color', 'white');

  }
}
