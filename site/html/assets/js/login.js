function createRipple(event) {
    console.log("called")
    console.log(this)

    const circle = document.createElement("span");
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - this.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - this.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const form = document.getElementById("input-button")
    const ripple = form.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }
    form.appendChild(circle);
}

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
        url: '/button_press/:login',
        success: function(data) {
            $('.notification-container').css("display", data.display);  
        }
    });
});