//changes the comic img shown by changing its srcs
function changeImage(url) {
  document.getElementById("comic").src = url;
}

//changes the comic title shown and displays which comic/page it is
function changeTitle(name, page) {
  document.getElementById("title").innerText = name + ", #" + page;
}

//changes whant is shown in the transcript section
function changeTranscript(newTranscript) {
  let editedTranscript = "";
  //removes weird characters
  for(var i = 0;i < newTranscript.length;i++) {
    if(newTranscript.charCodeAt(i) <= 127) {
      editedTranscript += newTranscript.charAt(i);
    }
  }
  //this adds an extra space for readability
  editedTranscript = editedTranscript.replace(/\n/g,"\n\n");
  //removes the [[]] and {{}} characters with * to make it more readable
  editedTranscript = editedTranscript.replace(/\[\[/g, "\n*");
  editedTranscript = editedTranscript.replace(/\]\]/g,"*\n");
  editedTranscript = editedTranscript.replace(/\{\{/g, "\n*");
  editedTranscript = editedTranscript.replace(/\}\}/g,"*\n");
  document.getElementById("transcript").innerText = editedTranscript;
}

//displays the date
function changeDate(year, month, day) {
  document.getElementById("date").innerText = year + "/" + month + "/" + day;
}

//changes the URL in the search bar
function changeURL(page) {
  var currentURL = new URL(document.URL);

  currentURL.hash = '#' + page;

  var newURL = currentURL.href;

  document.location.href = newURL;
}

//checks if the new page that the user wants to head to is valid and within the range of available comics
function isValidPage(newPageInt, latestComicNumber) {
  console.log(newPageInt);
  console.log(latestComicNumber);
  if(newPageInt <= latestComicNumber && newPageInt >= 1) {
    return true;
  } else {
    return false;
  }
}

//calls the nextPage function on the server and changes the website accordingly
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
        //calls all of the change_ functions
        changeImage(data["img"]);
        changeDate(data["year"],data["month"],data["day"]);
        changeTranscript(data["transcript"]);
        changeURL(currentComic);
        changeTitle(data["title"],currentComicString);
      },
      fail: function(error) {
          console.log(error);
      }
  });
}

//calls the latestPage function from the server and gets the latest page number
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
          console.log(error);
      },
      async:false
  });

  return latestComicNumber;
}


jQuery(document).ready(function() {
  //starts at page 1000
  let currentComic = 1000;
  let buttonClicked = 0;
  let currentComicString = "";
  let latestComicNumber = 2472;


  latestComicNumber =  getLatest();
  changePage(currentComicString, currentComic);

  //decrements the currentComic counter if with the range and calls the changePage function
  document.getElementById('left_btn').onclick = function(e) {
    console.log("left button clicked");
    if(currentComic <= 1) {
      alert("There is no comic before this one.");
    } else {
      currentComic -= 1;
      currentComicString = currentComic.toString();
      changePage(currentComicString,currentComic);
      buttonClicked = 1;
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
  }

  //increments the currentComic counter if with the range and calls the changePage function
  document.getElementById('right_btn').onclick = function(e) {
    console.log("right button clicked");
    if(currentComic == latestComicNumber) {
      alert("There is no comic after this one.");
    } else {
      currentComic += 1;
      currentComicString = currentComic.toString();
      changePage(currentComicString,currentComic);
      buttonClicked = 1;
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
  }

  //finds a number with the range of comics and sets currentComic to that number and changes the page to that number
  document.getElementById('random_btn').onclick = function(e) {
    console.log("random button clicked");
    let randPage = 0;
    randPage = Math.floor(Math.random() * (latestComicNumber - 1) + 1);
    currentComic = randPage;
    changePage(currentComicString,currentComic);
    $('html, body').animate({ scrollTop: 0 }, 'fast');

  }

  //switchs currentComic to the latestComicNumber and changes page accordingly
  document.getElementById('latest_btn').onclick = function(e) {
    console.log("latest button clicked");
    currentComic = latestComicNumber;
    changePage(currentComicString,currentComic);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  //this listens for any changes to the hash and will switch to the new page number if it is a valid number
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
