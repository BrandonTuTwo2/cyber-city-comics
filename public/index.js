function changeImage(url) {
  document.getElementById("comic").src = url;
}


jQuery(document).ready(function() {
  let currentComic = 300;

  document.getElementById('left_btn').onclick = function(e) {
    console.log("left button clicked");
    currentComic -= 1;
    let currentComicString = currentComic.toString();
    jQuery.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything
        url: '/nextPage',   //The server endpoint we are connecting to
        data: {
            page: currentComicString,
        },
        success: function (data) {
          console.log(data);
          changeImage(data["img"]);
        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error);
        }
    });
  }

  document.getElementById('right_btn').onclick = function(e) {
    console.log("right button clicked");
    currentComic += 1;
    let currentComicString = currentComic.toString();
    jQuery.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything
        url: '/nextPage',   //The server endpoint we are connecting to
        data: {
            page: currentComicString,
        },
        success: function (data) {
          console.log(data);
          changeImage(data["img"]);
        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error);
        }
    });
  }
});
