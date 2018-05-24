$(document).ready(function () {

    $("#recipes-modal").on("click", "#add-favorite", function () {
        var recipeId = $(this).attr("recipe-id");
        var recipeName = $(this).attr("recipe-name");
        var recipeImage = $(this).attr("image");
        console.log(recipeId);

        var data = {
            id: recipeId,
            name: recipeName,
            image: recipeImage
        }
        $.ajax("/api/favorites/", {
            type: "POST",
            data: data

        }).then(function () {
            console.log("Sent favorite data");
            $("#add-favorite").css("color", "red");
            //do something to change the heart color or something
        })
    })

    $("#favorites-area").on("click", ".remove-favorite", function () {
        //console.log("this has been hit");
        var recipeId = $(this).attr("recipe-id");
        $.ajax("/api/favorites/" + recipeId, {
            type: "DELETE"
        }).then(function () {
            window.location.assign("/profile");
        })
    })


})