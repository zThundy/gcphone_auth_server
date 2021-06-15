$(document).ready(function () {
    setTimeout(() => {
        $("body").removeClass("preload");
    })

    $("html").on("contextmenu", function(e) { return false; });
    document.getElementById('logo-pic').setAttribute('draggable', false);
});

$("#notification-button").click(() => {
    console.log("button has been clicked")
    $.ajax({
        type: 'GET',
        url: '/button_press/:register',
        success: function(data) {
            $('.notification-container').css("display", data.display);  
        }
    });
});