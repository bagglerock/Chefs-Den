var filters = [
    {
        name: "cuisines",
        filters: ["african", "chinese", "japanese", "korean", "vietnamese", "thai", "indian", "british", "irish", "french", "italian", "mexican", "middle eastern", "jewish", "american", "cajun", "indian", "greek", "german", "nordic", "eastern european", "caribbean", "latin american"]
    },
    {
        name: "diets",
        filters: ["pescetarian", "lacto vegetarian", "ovo vegetarian", "vegan", "paleo, primal", "and vegetarian"]
    },
    {
        name: "intolerances",
        filters: ["dairy", "egg", "gluten", "peanut", "sesame", "seafood", "shellfish", "soy", "sulfite", "tree nut", "wheat"]
    }
];
    
function makeButtonsFor(filterName){
    $("#" + filterName + "-content").empty();
    for (var i = 0; i< filters.length; i++){
        var filter = filters[i];
        if (filterName === filter.name){
            for (var j = 0; j < filter.filters.length; j++){
                $("#" + filterName + "-section").empty();
                var button = $("<button>");
                button.addClass("filter-button");
                button.text(filter.filters[j]);
                $("#" +filterName + "-content").append(button);
            }
        }
    }
}

$(document).ready(function () {


    $(".login-buttons").hover(
        (function () {
            $(this).css("color", "yellow");
        }),
        (function () {
            $(this).css("color", "white");
        })
    );

    $("#open-login-modal").on("click", function () {
        $("#login-modal").show();
    })

    $("#open-signup-modal").on("click", function () {
        $("#signup-modal").show();
    })

    $(".close").on("click", function () {
        $(".modal").hide();
        showFilters();
    })

    $(document).on("click", function (event) {
        var modalClass = document.getElementsByClassName("modal");
        for (var i = 0; i < modalClass.length; i++) {
            if (event.target == modalClass[i]) {
                $(".modal").hide();
            }
        }
    });

    $(".cancelbtn").on("click", function () {
        $(".modal").hide();
    })

    $("#open-filters-modal").on("click", function () {

        //function to make the buttons and append them to the modal
        makeButtonsFor("cuisines");
        makeButtonsFor("diets");
        makeButtonsFor("intolerances");

        //show the modal
        $("#filters-modal").show();
    })

    $("#search-button").on("click", function(event) {
        event.preventDefault();

        var query = {
            query: $("#query").val().trim()
        };

        $.ajax("/api/recipes", {
            type: "POST",
            data: query
          }).then(function() {
                console.log("posted stuff");
                location.reload();

            }
          );
    })

    $("#login").on("click", function() {
        event.preventDefault();

        var loginInfo = {
            username: $("#username").val().trim(),
            password: $("#password").val().trim()
        }
        $.ajax("/api/login", {
            type: "POST",
            data: loginInfo

        }).then(function() {
            console.log("User is logging in");
            location.reload();
        })
    })

    $("#sign-up").on("click", function() {
        event.preventDefault();
        
        var newUser = {
            username: $("#username").val().trim(),
            email: $("#email").val().trim(),
            password: $("$password").val().trim(),
            about: $("#about").val().trim(),
            img_url: $("#img-url").val().trim()
        }
        $.ajax("/api/user", {
            type: "POST",
            data: newUser
        }).then(function() {
            console.log("User has been added.");
            location.reload();
        })
    })

})