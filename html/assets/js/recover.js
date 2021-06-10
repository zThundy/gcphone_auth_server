$(document).ready(function () {
    setTimeout(() => {
        $("body").removeClass("preload");
    })

    $("html").on("contextmenu", function(e) { return false; });
    document.getElementById('logo-pic').setAttribute('draggable', false);

    // if (document.location.search.includes("success=")) {
    //     var state = document.location.search.split("=");
    //     if (state[1] && state[1] == "false") {
    //         $("#notification-icon").addClass("fas")
    //         $("#notification-icon").addClass("fa-times-circle")
    //         $("#notification-icon").css("color", "rgb(191 33 33)")
    //         $(".notification-text").text("Sorry this is not implemented (yet)")
    //         $(".notification-container").css("display", "");
    //         $(".notification-container").addClass("show");
    //         setTimeout(() => {
    //             $(".notification-container").css("opacity", "1");
    //         }, 200)
    //         $("#notification-button").click((e) => {
    //             $(".notification-container").addClass("hide");
    //             setTimeout(() => {
    //                 $("#notification-icon").removeClass("fas")
    //                 $("#notification-icon").removeClass("fa-times-circle")
    //                 $(".notification-container").removeClass("show");
    //                 $(".notification-container").css("display", "none");
    //                 $(".notification-container").css("opacity", "0");
    //                 $('.notification-container').off('click');
    //             }, 200);
    //         })
    //     }
    // }
});

$("#notification-button").click(() => {
    console.log("button has been clicked")
    $.ajax({
        type: 'GET',
        url: '/site/button_press/:recover',
        success: function(data) {
            $('.notification-container').css("display", data.display);  
        }
    });
});