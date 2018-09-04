// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  request.execute(function(response) {
    var items = response.items;
    console.log(items);
    // console.log(str[0]);
    $('#search-container').html("<table>");
    for(var i=0;i<items.length;i++){
      if(typeof items[i].id.videoId != 'undefined'){
        $('#search-container').append("<tr><td><img src='"+items[i].snippet.thumbnails.default.url+"'></img></td><td style='width:75%;'><a href='https://www.youtube.com/watch?v="+items[i].id.videoId+"'>"+items[i].snippet.title+"</a></td></tr><br>");
      }
      else if (typeof items[i].id.channelId != 'undefined') {
        $('#search-container').append("<tr><td ><img src='"+items[i].snippet.thumbnails.default.url+"'></img></td><td style='width75%;:'><a href='https://www.youtube.com/channel/"+items[i].id.channelId+"'>Channel : "+items[i].snippet.title+"</a></td></tr><br>");
      }

    }
    $('#search-container').append("</table>");
  });
}
// <table><tr><td></td></tr></table>
