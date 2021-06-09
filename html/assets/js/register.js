$(document).ready(function () {
    setTimeout(() => {
        $("body").removeClass("preload");
    })

    $("html").on("contextmenu", function(e) { return false; });
    document.getElementById('logo-pic').setAttribute('draggable', false);

    // if (document.location.search.includes("success=")) {
    //     var state = document.location.search.split("=");
    //     if (state[1] && state[1] == "true") {
    //         $("#notification-icon").addClass("fas")
    //         $("#notification-icon").addClass("fa-check-circle")
    //         $("#notification-icon").css("color", "rgb(153, 194, 108)")
    //         $(".notification-text").text("User registered succesfully! You can now login")
    //         $(".notification-container").css("display", "");
    //         $(".notification-container").addClass("show");
    //         setTimeout(() => {
    //             $(".notification-container").css("opacity", "1");
    //         }, 200)
    //         $("#notification-button").click((e) => {
    //             $(".notification-container").addClass("hide");
    //             setTimeout(() => {
    //                 $("#notification-icon").removeClass("fas")
    //                 $("#notification-icon").removeClass("fa-check-circle")
    //                 $(".notification-container").removeClass("show");
    //                 $(".notification-container").css("display", "none");
    //                 $(".notification-container").css("opacity", "0");
    //                 $('.notification-container').off('click');
    //             }, 200);
    //         })
    //     } else {
    //         $("#notification-icon").addClass("fas")
    //         $("#notification-icon").addClass("fa-times-circle")
    //         $("#notification-icon").css("color", "rgb(191 33 33)")
    //         $(".notification-text").text("Check username and passwords and try again...")
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
    jQuery.post("/site/button_press/register");
})