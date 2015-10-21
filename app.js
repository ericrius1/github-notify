var $ = require('jquery');
var ipc = require('ipc');
var path = require('path');

var url = "https://secure-wave-3682.herokuapp.com/github";
var userName = null;
var nameEntered = false;

var previousUpdateId = null;
var latestUpdateId = null;

var bellUrl = path.join(__dirname, 'bells.wav');
var bells = new Audio(bellUrl);




$('#username_button').on('click', function() {
    userName = $("#username_input").val(); 

    if(!nameEntered) {
        nameEntered = true;
        setInterval(pollForComments, 5000);
    }
});

function pollForComments() {
    console.log('poll');
    $.ajax({
        method: "GET",
        url: url,
        success: function(data) {
            updateCount(data);
        }
    });
}

function updateCount(data) {
    latestUpdateId = data.id
      ipc.send("newComment", "data");
      bells.currentTime = 0;
      bells.play();
    if(latestUpdateId === previousUpdateId) {
        //Nothing new has happened, so return
        return;
    }
    // console.log("success! ", data);
    if(data.pull_request && data.pull_request.user.login === userName) {
      ipc.send("newComment", "data");
    }

    if(data.issue && data.issue.user.login === userName) {
    }


    previousUpdateId = latestUpdateId;
}


