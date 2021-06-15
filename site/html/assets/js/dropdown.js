$(document).ready(function () {
    setTimeout(() => {
        $("body").removeClass("preload");
    })
    $("html").on("contextmenu", function(e) { return false; });

    $("#random-hyperlink").click(() => {
        $('.lines-button').removeClass('close');
        $("#sidebar-options-container").css("width", "0px");
    })
    
    $(document).on('click', ".lines-button", function () {
        $('.lines-button').addClass('close');
        $("#sidebar-options-container").css("width", "250px");
        $("#sidebar-options-container").css("background-color", "rgb(49, 49, 49)");
    });
    $(document).on('click', ".lines-button.close", function () {
        $('.lines-button').removeClass('close');
        $("#sidebar-options-container").css("width", "0px");
        $("#sidebar-options-container").css("background-color", "rgb(10, 10, 10)");
    });
})