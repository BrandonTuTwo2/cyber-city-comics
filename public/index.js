function changeImage(url) {
  document.getElementById("comic").src = url;
}

function changeTitle(name, page) {
  document.getElementById("title").innerText = name + ", #" + page;
}

function changeTranscript(newTranscript) {
  let editedTranscript = "";

  //removes weird characters
  for(var i = 0;i < newTranscript.length;i++) {
    if(newTranscript.charCodeAt(i) <= 127) {
      editedTranscript += newTranscript.charAt(i);
    }
  }

  editedTranscript = editedTranscript.replace(/\n/g,"\n\n");

  editedTranscript = editedTranscript.replace(/\[\[/g, "\n*");
  editedTranscript = editedTranscript.replace(/\]\]/g,"*\n");

  editedTranscript = editedTranscript.replace(/\{\{/g, "\n*");
  editedTranscript = editedTranscript.replace(/\}\}/g,"*\n");


  document.getElementById("transcript").innerText = editedTranscript;
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

function isValidPage(newPageInt, latestComicNumber) {
  console.log(newPageInt);
  console.log(latestComicNumber);
  if(newPageInt <= latestComicNumber && newPageInt >= 1) {
    return true;
  } else {
    return false;
  }
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

        changeTranscript(data["transcript"]);
        //test = JSON.parse(test);
        changeURL(currentComic);
        changeTitle(data["title"],currentComicString);
      },
      fail: function(error) {
          // Non-200 return, do something with error
          console.log(error);
      }
  });

  console.log("testtestsets");
}

function getLatest() {
  var latestComicNumber = 0;
  jQuery.ajax({
      type: 'get',
      dataType: 'json',
      url: '/latestPage',
      data: {
      },
      success: function (data) {
        latestComicNumber = Number(data["num"]);
        console.log("hi there " + latestComicNumber);

      },
      fail: function(error) {
          // Non-200 return, do something with error
          console.log(error);
      },
      async:false
  });


  return latestComicNumber;
}


jQuery(document).ready(function() {
  let currentComic = 1000;
  let buttonClicked = 0;
  let currentComicString = "";
  let latestComicNumber = 2472;


  latestComicNumber =  getLatest();

  changePage(currentComicString, currentComic);

  document.getElementById('left_btn').onclick = function(e) {
    console.log("left button clicked");
    if(currentComic <= 1) {
      alert("There is no comic before this one.");
    } else {
      currentComic -= 1;
      currentComicString = currentComic.toString();
      changePage(currentComicString,currentComic);
      buttonClicked = 1;
    }
  }

  document.getElementById('right_btn').onclick = function(e) {
    console.log("right button clicked");
    if(currentComic == latestComicNumber) {
      alert("There is no comic after this one.");
    } else {
      currentComic += 1;
      currentComicString = currentComic.toString();
      changePage(currentComicString,currentComic);
      buttonClicked = 1;
    }
  }

  document.getElementById('random_btn').onclick = function(e) {
    console.log("random button clicked");
    let randPage = 0;
    randPage = Math.floor(Math.random() * (latestComicNumber - 1) + 1);
    currentComic = randPage;

    changePage(currentComicString,currentComic);
  }


  window.addEventListener('hashchange', function() {
       if(buttonClicked == 1) {
         buttonClicked = 0;
       } else {
         var newPage = new URL(document.URL).hash;
         newPage = newPage.toString();
         newPage = newPage.substring(1);

         var newPageInt = Number(newPage);
         if(isValidPage(newPageInt,latestComicNumber)) {
           changePage(newPage,newPageInt);
           currentComic = newPageInt;
           console.log(newPage);
         } else {
           alert("Invalid page number please try again.");
         }
       }
  });

});
