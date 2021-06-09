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
    document.getElementById('logo-pic').setAttribute('draggable', false);
    $("#input-button").click(createRipple)

    $(".notification-container").css("display", "none");
    if (document.location.search.includes("success=")) {
        var state = document.location.search.split("=");
        if (state[1] && state[1] == "false") {
            $("#notification-icon").addClass("fas")
            $("#notification-icon").addClass("fa-times-circle")
            $("#notification-icon").css("color", "rgb(191 33 33)")
            $(".notification-text").text("Username or password is wrong...")

            $(".notification-container").css("display", "");
            $(".notification-container").addClass("show");
            setTimeout(() => {
                $(".notification-container").css("opacity", "1");
            }, 200)

            $("#notification-button").click((e) => {
                $(".notification-container").addClass("hide");
                setTimeout(() => {
                    $("#notification-icon").removeClass("fas")
                    $("#notification-icon").removeClass("fa-times-circle")
                    $(".notification-container").removeClass("show");

                    $(".notification-container").css("display", "none");
                    $(".notification-container").css("opacity", "0");
                    $('.notification-container').off('click');
                }, 200);
            })
        }
    }
});