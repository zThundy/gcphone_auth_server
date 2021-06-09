$("#sidebar-opener").click(() => {
    document.getElementById("sidebar-options-container").style.width = "250px";
})

function closeNav() {
    document.getElementById("sidebar-options-container").style.width = "0";
}