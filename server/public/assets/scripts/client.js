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
    $('.displayTasks').append('<div class="tasks" data-id='+""+ choresArray[i].id + ">" + "</div>");
    var $el = $('.displayTasks').children().last();
    $el.append('<li>' + choresArray[i].chore + '</li>');
    $el.append('<button class="delete" data-id='+""+ choresArray[i].id + ">" + "X</button>");
    $el.append('<button class="complete" data-id='+""+ choresArray[i].id + ">" + "✓</button>");

  }


  $('.displayTasks').on('click', '.delete', function(){
    var id = $(this).data('id');
    var deleteData = {"id": "" + id};
    console.log("id", "id");
      console.log(deleteData);
    deleteChore(deleteData);


  });

  $('.displayTasks').on('click', '.complete', completeChore);

  function deleteChore(deleteData){
    // $(this).parent().remove();
    //find the id that is on the button and set it to id
    // console.log("inside deleteChore function before ajax" ,deleteData);
    $.ajax({
      type: 'DELETE',
      url: '/todo',
      data: deleteData,
      success: getChores
    });
  }

  function completeChore (){
    $(this).parent().css('background-color', 'white');

  }
}
