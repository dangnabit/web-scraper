$(document).on('click', '.article', function() {
  var $note = $('#note');
  $note.empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
      method: 'GET',
      url: '/api/article/' + thisId
    })
    .done(function(data) {
      // console.log(data);
      $note.append('<h4>' + data.title + '</h4>');
      $note.append('<input id="titleinput" name="title" placeholder="Note Title">');
      $note.append('<textarea id="bodyinput" name="body"placeholder="Note Body" rows="4"></textarea>');
      $note.append('<button class="btn btn-lg btn-success" data-id="' + data._id + '" id="savenote">Save Note</button>');

      if (data.note) {
        console.log(data.note);
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
      $('#noteModal').modal('toggle');
      });
    });


$(document).on('click', '#savenote', function() {
  var thisId = $(this).attr('data-id');

  console.log(thisId);
  $.ajax({
      method: 'POST',
      url: '/api/articles/' + thisId,
      data: {
        title: $('#titleinput').val(),
        body: $('#bodyinput').val()
      }
    })
    .done(function(data) {
      console.log(data);
      $note.html('<h1>Thank You!</h1>');
      $('#noteModal').modal('toggle');
    });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});

$(document).on('click', '#scrape', function() {
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).done(function(data) {
    console.log('Scrape Complete!');
    window.reload();
  });
});
