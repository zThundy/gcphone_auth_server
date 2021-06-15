$(document).ready(function () {
    if (document.location.search.includes("username=")) {
        var state = document.location.search.split("=");
        if (state[1]) {
            $(".dashboard-username").text("Welcome " + state[1]);
        }
    }

    setTimeout(() => {
        $("body").removeClass("preload");
    })
    $("html").on("contextmenu", function(e) { return false; });

    $("#random-hyperlink").click(() => {
        $('.lines-button').removeClass('close');
        $("#sidebar-options-container").css("width", "0px");
        $(".dashboard-username").css("padding-left", "0px");
    })
    
    $(document).on('click', ".lines-button", function () {
        $('.lines-button').addClass('close');
        $("#sidebar-options-container").css("width", "350px");
        $("#sidebar-options-container").css("background-color", "rgb(49, 49, 49)");
        $(".dashboard-username").css("padding-left", "350px");
    });
    $(document).on('click', ".lines-button.close", function () {
        $('.lines-button').removeClass('close');
        $("#sidebar-options-container").css("width", "0px");
        $("#sidebar-options-container").css("background-color", "rgb(10, 10, 10)");
        $(".dashboard-username").css("padding-left", "0px");
    });
})