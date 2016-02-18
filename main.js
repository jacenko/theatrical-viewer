$(document).ready(function() {
  var movies = [];

  $.ajax({
    url: 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=' + rtKey,
    dataType: 'jsonp',
    success: function(data) {
      var output = '';
      $.each(data.movies, function(key, movie) {
        movies[key] = {
          "title": movie.title,
          "year": movie.year,
          "actor1": movie.abridged_cast[0].name,
          "actor2": movie.abridged_cast[1].name,
          "synopsis": movie.synopsis,
          "critics_rating": movie.ratings.critics_rating,
          "critics_score": movie.ratings.critics_score,
          "audience_rating": movie.ratings.audience_rating,
          "audience_score": movie.ratings.audience_score
        };
        if(key == 0) {
          loadTrailer(movie.title, key);
        }
        output += '<li>' + movie.title + '</li>';
      }); // each
      $('#movies').html(output);
    } // success
  }); // ajax

  $('.info').css('height', '90px');

  $(document).on( 'click', 'li', function() {
    loadTrailer(this.innerHTML, $(this).index());
  }); // on.click

  $('.expand').click(function() {
    var expand = $('.info').css('height');
    if (expand == '90px') {
      expand = '';
      $('.expand span').text('Read Less');
    } else {
      expand = '90px'
      $('.expand span').text('Read More');
    }
    $('.info').css('height', expand);

  });

  function loadTrailer(title, index) {
    $('#title').text(movies[index].title +
      ' (' + movies[index].year + ')');
    $('#starring').text('Starring ' +
      movies[index].actor1 + ' and ' + movies[index].actor2);
    $('#synopsis').text(movies[index].synopsis);
    loadTomatoes(index);
    var trailerSearchString = title + ' trailer';
    $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' +
        encodeURIComponent(trailerSearchString) +
        '&key=' + ytKey + '&maxResults=1',
      dataType: 'jsonp',
      success: function(data) {
        var resultId = data.items[0].id.videoId;
        $('iframe').attr('src', 'http://www.youtube.com/embed/' + resultId);
      } // success
    }); // ajax
  } // loadTrailer()

  function loadTomatoes(index) {
    var position = '';
    switch (movies[index].critics_rating) {
      case 'Fresh':
        position = '0 0';
        break;
      case 'Rotten':
        position = '-35px 0';
        break;
      default:
        position = '-70px 0';
    }
    $('#critics').css('background-position', position)
      .text(movies[index].critics_score + '%');

    if (movies[index].audience_rating == 'Upright') {
      position = '-70px -35px';
    } else {
      position = '0 -35px';
    }
    $('#audience').css('background-position', position)
      .text(movies[index].audience_score + '%');

    $('#ratings').css('visibility', 'visible');
  }
}); // document.ready
