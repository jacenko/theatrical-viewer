$(document).ready(function() {
  $.ajax({
    url: 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=' + rtKey,
    dataType: 'jsonp',
    success: function(data) {
      var output = '';
      $.each(data.movies, function(key, movie) {
        if(key == 0) {
          loadTrailer(movie.title);
        }
        output += '<li>' + movie.title + '</li>';
      });
      $('#movies').html(output);
    }
  });

  $(document).on( 'click', 'li', function() {
    loadTrailer(this.innerHTML);
  }); // on.click

  function loadTrailer(title) {
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
}); // document.ready
