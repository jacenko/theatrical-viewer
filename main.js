$(document).ready(function() {
  var movies = [];    // Array to store movies in list

  $.ajax({
    // Connect to the Rotten Tomatoes API with your API key from keys.js
    url: 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=' + rtKey,
    dataType: 'jsonp',
    success: function(data) {
      var output = '';
      $.each(data.movies, function(key, movie) {
        // Populate movies[] with information from Rotten Tomatoes
        movies[key] = {
          "title": movie.title,                               // Casablanca
          "year": movie.year,                                 // 1942
          "actor1": movie.abridged_cast[0].name,              // Humphrey Bogart
          "actor2": movie.abridged_cast[1].name,              // Ingrid Bergman
          "synopsis": movie.synopsis,                         // "...a story of..."
          "critics_rating": movie.ratings.critics_rating,     // Certified Fresh
          "critics_score": movie.ratings.critics_score,       // 97
          "audience_rating": movie.ratings.audience_rating,   // Upright
          "audience_score": movie.ratings.audience_score      // 95
        };
        // Load trailer for first loaded movie
        if(key == 0) {
          loadTrailer(movie.title, key);
        }
        // Create list item for the movie list
        output += '<li>' + movie.title + '</li>';
      }); // each
      // Output our movie list items to <ul id='movies'></ul>
      $('#movies').html(output);
    } // success
  }); // ajax

  // Set a fixed height for the movie description section
  // (removing this height will make the entire section show)
  $('.info').css('height', '90px');

  // Load trailer for a clicked movie
  $(document).on( 'click', 'li', function() {
    loadTrailer(this.innerHTML, $(this).index());
  }); // on.click

  // Clicking "Read More" removes height from description and sets button text to "Read Less"
  // Clicking "Read Less" adds 90px height to description and sets button text to "Read More"
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

  // Load YouTube trailer (searching for 'title').
  // Show Rotten Tomatoes information for ('index' of) clicked movie
  function loadTrailer(title, index) {
    // Get movie information from the matching index in movies[]
    $('#title').text(movies[index].title +
      ' (' + movies[index].year + ')');
    $('#starring').text('Starring ' +
      movies[index].actor1 + ' and ' + movies[index].actor2);
    $('#synopsis').text(movies[index].synopsis);
    // Show Rotten Tomatoes Critics/Audience Ratings
    loadTomatoes(index);
    var trailerSearchString = title + ' trailer';
    $.ajax({
      // Connect to the YouTube Data API with your API key from keys.js
      // Get the first result of 'MOVIE_TITLE trailer'
      url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' +
        encodeURIComponent(trailerSearchString) +
        '&key=' + ytKey + '&maxResults=1',
      dataType: 'jsonp',
      success: function(data) {
        // Embed resulting YouTube video in an iframe
        var resultId = data.items[0].id.videoId;
        $('iframe').attr('src', 'http://www.youtube.com/embed/' + resultId);
      } // success
    }); // ajax
  } // loadTrailer()

  // Load Rotten Tomatoes Critics/Audience score 
  // and associated image portion from assets.png
  function loadTomatoes(index) {
    var position = '';
    // Check if movie is Fresh, Certified Fresh, or Rotten
    switch (movies[index].critics_rating) {
      case 'Fresh':
        position = '0 0';
        break;
      case 'Rotten':
        position = '-35px 0';
        break;
      default:
        position = '-70px 0';
    } // switch()
    // Show Critics score
    $('#critics').css('background-position', position)
      .text(movies[index].critics_score + '%');
      
    // Check if movie is rated Upright or Spilled by the audience
    // and apply associated image portion from assets.png
    if (movies[index].audience_rating == 'Upright') {
      position = '-70px -35px';
    } else {
      position = '0 -35px';
    }
    // Show Audience score
    $('#audience').css('background-position', position)
      .text(movies[index].audience_score + '%');
      
    $('#ratings').css('visibility', 'visible');
  } // loadTomatoes()
}); // document.ready
