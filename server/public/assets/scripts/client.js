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
  // console.log('inside appenddom after GET call', choresArray);

  //empty tasks for when new submits are entered. this allows the formdata to not be displayed more than once.
  $('.tasks').remove();
  for (var i = 0; i < choresArray.length; i++) {
    var id = choresArray[i].id;
    if(choresArray[i].complete == false){
      $('.displayTasks').append('<div class="tasks" data-id='+""+ id + ">" + "</div>");
      var $el = $('.displayTasks').children().last();
      $el.append('<li>' + choresArray[i].chore + '</li>');
      $el.append('<button class="delete id'+id+'" data-id='+""+ id + ">" + "X</button>");
      $el.append('<button class="complete id'+id+'" data-id='+""+ id + ">" + "✓</button>");
      $(".id"+id).data({id: id, complete: true});
  }else{
      $('.displayTasks').append('<div class="tasks id'+id+'"  data-id='+""+ id + ">" + "</div>");
      var $el = $('.displayTasks').children().last();
      $el.append('<li>' + choresArray[i].chore + '</li>');
      $el.append('<button class="delete id'+id+'" data-id='+""+ id + ">" + "X</button>");
      $el.append('<button class="complete id'+id+'" data-id='+""+ id + ">" + "✓</button>");
      $(".id"+id).data({id: id, complete: false});
      // changeChore(choresArray[i]);
      $()
  }
}
  //this click event wasnt working in the doc ready. which is why it is here.
  $('.displayTasks').on('click', '.delete', function(){
    var id = $(this).data('id');
    var deleteData = {"id": "" + id};
    console.log("id", "id");
    // console.log(deleteData);
    deleteChore(deleteData);


  });

  //this click event wasnt working in the doc ready. which is why it is here.
  $('.displayTasks').on('click', '.complete', function(){
    var completeData = {};
    completeData.id = $(this).data('id');

    //added this.
    completeData.complete = $(this).data('true');

    completeChore(completeData);
  });

  function deleteChore(deleteData) {
    $.ajax({
      type: 'DELETE',
      url: '/todo',
      data: deleteData,
      success: getChores
    });
  }


  function completeChore (completeData){


    $.ajax({
      type: 'PUT',
      url: '/todo',
      data: completeData,
      success: function(){
        console.log("back from server", completeData);
        changeChore(completeData);
        // getChores();

    }
  });
  }
// the array and database logs out as true (in regards to the completed column. but it WONT update the DOM :(
function changeChore(completeData) {
    // console.log("!!!!!!",completeData.complete);
    if(completeData[0] == true) {
    console.log("this worked", completeData);
    $(this).addClass('dumb');
} else{
  console.log('this didnt work');
  $(this).parent().css('background-color', 'white');
}


  // complete.id = $(this).data('id');
  // complete.status = "false";
    // }
    // if($(this).data('complete') == true) {
    //   $(this).parent().css('background-color', 'white');
      // console.log("in changeChore",completeData);
    // }
  }
}
