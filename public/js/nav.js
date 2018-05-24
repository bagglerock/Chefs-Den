$(document).ready(function () {

    $("#open-home-page").on("click", function () {
        $.ajax("/", {
            type: "GET"
        }).then(function () {
            window.location.assign("/");
        })
    })

    $("#open-favorite-page").on("click", function () {
        $.ajax("/profile/", {
            type: "GET"
        }).then(function () {
            window.location.assign("/profile/");
        })
    })

    $("#open-cart-page").on("click", function () {
        $.ajax("/cart/", {
            type: "GET"
        }).then(function () {
            window.location.assign("/cart/");
        })
    })

    $("#log-out").on("click", function () {
        $.ajax("/logout", {
            type: "GET"
        }).then(function () {
            window.location.assign("/");
        })
    })



})