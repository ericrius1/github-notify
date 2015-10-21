var $ = require('jquery');
var ipc = require('ipc');
var path = require('path');

var shell = require("shell");

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
        setInterval(pollForComments, 2000);
    }
});

function pollForComments() {
    $.ajax({
        method: "GET",
        url: url,
        success: function(data) {
            update(data);
        }
    });
}

function update(data) {
    latestUpdateId = data.id
    if(latestUpdateId === previousUpdateId) {
        //Nothing new has happened, so return
        return;
    }
    if(data.pull_request && data.pull_request.user.login === userName) {
        updateView(data.comment.body, data.comment.html_url);
    }

    if(data.issue && data.issue.user.login === userName) {
       updateView(data.comment.body, data.comment.html_url);
    }

    previousUpdateId = latestUpdateId;
}

function updateView(comment, url) {

    ipc.send("newComment");
    $('#latest_comment').html(comment);
    $('#link').attr('href', url);
    $('#link').text(url);
    bells.currentTime = 0;
    bells.play();
    

}


