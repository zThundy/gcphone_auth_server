$("#sidebar-opener").click(() => {
    $("#sidebar-menu-open-button").addClass("rotate");
    document.getElementById("sidebar-options-container").style.width = "250px";
})

$("#sidebar-closer").click(() => {
    $("#sidebar-menu-open-button").removeClass("rotate");
    document.getElementById("sidebar-options-container").style.width = "0";
})

$(document).ready(function () {
    setTimeout(() => {
        $("body").removeClass("preload");
    })
    $("html").on("contextmenu", function(e) { return false; });
})