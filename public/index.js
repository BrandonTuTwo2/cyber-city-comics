function changeImage(url) {
  document.getElementById("comic").src = url;
}

function changeDate(year, month, day) {
  document.getElementById("date").innerText = year + "/" + month + "/" + day;
}

function changeURL(page) {
  // document.URL is the current url
  var currentURL = new URL(document.URL);
  currentURL.hash = '#' + page;

  // new url
  var newURL = currentURL.href;

  // change the current url
  document.location.href = newURL;
}

function changePage(currentComicString, currentComic) {
  jQuery.ajax({
      type: 'get',
      dataType: 'json',
      url: '/nextPage',   
      data: {
          page: currentComicString,
      },
      success: function (data) {
        console.log(data);
        changeImage(data["img"]);
        changeDate(data["year"],data["month"],data["day"]);
        changeURL(currentComic);
      },
      fail: function(error) {
          // Non-200 return, do something with error
          console.log(error);
      }
  });
}

jQuery(document).ready(function() {
  let currentComic = 300;
  let buttonClicked = 0;
  changeURL(300);

  document.getElementById('left_btn').onclick = function(e) {
    console.log("left button clicked");
    currentComic -= 1;
    let currentComicString = currentComic.toString();
    changePage(currentComicString,currentComic);
    buttonClicked = 1;
  }

  document.getElementById('right_btn').onclick = function(e) {
    console.log("right button clicked");
    currentComic += 1;
    let currentComicString = currentComic.toString();
    changePage(currentComicString,currentComic);
    buttonClicked = 1;
  }


  window.addEventListener('hashchange', function() {
       if(buttonClicked == 1) {
         buttonClicked = 0;
       } else {
         var newPage = new URL(document.URL).hash;
         newPage = newPage.toString();
         newPage = newPage.substring(1);

         var newPageInt = Number(newPage);

         changePage(newPage,newPageInt);
         currentComic = newPageInt;
         console.log(newPage);
       }
  });

});
