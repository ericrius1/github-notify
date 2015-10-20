var url = "http://9c14a6a0.ngrok.io/github";
var userName = null;
var nameEntered = false;
var $ = require('jquery');

$('#username_button').on('click', function() {
    console.log('CLICK!');
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
    console.log("success! ", data);
}
