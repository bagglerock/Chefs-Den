//  Function to make the filter buttons in the filters modal
function makeButtonsFor(filterName) {
    $("#" + filterName + "-content").empty();
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filterName === filter.name) {
            for (var j = 0; j < filter.filters.length; j++) {
                $("#" + filterName + "-section").empty();
                var button = $("<button>");
                //  Take the search Value
                var searchValue = filter.filters[j];
                //  Find the string that follows the "^" character and set it as searchValueClean
                var regex = /(?<=\^)[\w+.-]+/;
                var searchValueClean = regex.exec(searchValue);
                //  If the word starts with cuisine (ie. cuisine-american) then get rid of the cuisine part
                //  Note:  regex.exec(string) returns an array - element 0 is the found word
                if(searchValueClean[0].startsWith("cuisine")){
                    //  regex:  take the value that follows "cuisine-"
                    var cuisineRegex = /(?<=cuisine-)[\w+.-]+/;
                    searchValueClean = cuisineRegex.exec(searchValueClean[0]);
                    //  Make the first letter capital
                    searchValueClean = searchValueClean[0].charAt(0).toUpperCase() + searchValueClean[0].substring(1);
                }
                button.addClass("filter-button " + filterName + "-button");
                button.attr("search-value", searchValue);
                button.text(searchValueClean);
                $("#" + filterName + "-content").append(button);
            }
        }
    }
}

//  Function to display the chosen filters for ingredients
function showChosenIngredients() {
    //  add a header to the ingredients area
    $("#ingredients-area").empty();
    if (chosenIngredients.length > 0) {
        var header = $("<h3>");
        header.text("Chosen Ingredients").addClass("chosen-ingredients-header");
        $("#ingredients-area").append(header);
    }
    // add each ingredient as a button to the ingredients area
    $("filters-area").append(header);
    for (var i = 0; i < chosenIngredients.length; i++) {
        var button = $("<button>");
        button.text(chosenIngredients[i]).addClass("filter-button fas fa-trash chosen-ingredient");
        $("#ingredients-area").append(button);
    }
}


$(document).ready(function () {
    
    //  Event listener: hovering over the buttons in the login area
    $(".login-buttons").hover(
        (function () {
            $(this).css("color", "yellow");
        }),
        (function () {
            $(this).css("color", "white");
        })
    );

    //  Event listener:  click to open login modal
    $("#open-login-modal").on("click", function () {
        $("#login-modal").show();
    })

    //  Event listener:  click to open sign-up modal
    $("#open-signup-modal").on("click", function () {
        $("#signup-modal").show();
    })

    //  Event listener: click to close(hide) the modal
    $(".close").on("click", function () {
        $(".modal").hide();
        showFilters();
    })

    //  Event listener:  click to close a general modal when clicked outside of the modal
    $(document).on("click", function (event) {
        var modalClass = document.getElementsByClassName("modal");
        for (var i = 0; i < modalClass.length; i++) {
            if (event.target == modalClass[i]) {
                $(".modal").hide();
            }
        }
    });

    //  Event listener:  click to close modal when cancel is clicked
    $(".cancelbtn").on("click", function () {
        $(".modal").hide();
    })

    //  Event listener:  click to open filters modal
    $("#open-filters-modal").on("click", function () {
        //functions to make the buttons and append them to the modal
        makeButtonsFor("cuisines");
        makeButtonsFor("diets");
        makeButtonsFor("intolerances");
        $("#filters-modal").show();
    })

    //  Event listener:  click to add an ingredient to the chose ingredients array
    $("#add-ingredient").on("click", function () {
        event.preventDefault();
        var query = $("#query").val().trim();
        chosenIngredients.push(query);
        showChosenIngredients();
        $("#query").val("");
    })

    //  Event listener:  click to subtract ingredient from the ingredients array
    $("#ingredients-area").on("click", ".chosen-ingredient", function() {
        //remove this ingredient from the array
        var ingredient = $(this).text();
        var indexOfIngredient = chosenIngredients.indexOf(ingredient);
        chosenIngredients.splice(indexOfIngredient,1);
        $("#ingredients-area").empty();
        showChosenIngredients();

    })

    //  Event listener:  
    $("#filters-modal").on("click", ".filter-button", function() {
        //if the filter is clicked toggle selected
        var filterName = $(this).text();
        var filterClass = $(this).attr("class");
        filterClass = filterClass.replace("filter-button ", "").replace("-button", "");
        console.log("Name is: " + filterName + " and the class is " + filterClass);

    })

    //  Event listener:  click to send login information
    $("#login").on("click", function (event) {
        event.preventDefault();
        var loginInfo = {
            username: $("#login-username").val().trim(),
            password: $("#login-password").val().trim()
        }
        $.ajax("/api/login", {
            type: "POST",
            data: loginInfo

        }).then(function () {
            console.log("User is logging in");
            location.reload();
        })
        $("#login-username").val("");
        $("#login-password").val("");
    })

    //  Event listener:  click to send signup information
    $("#signup-button").on("click", function (event) {
        event.preventDefault();

        var newUser = {
            username: $("#signup-username").val().trim(),
            email: $("#signup-email").val().trim(),
            password: $("#signup-password").val().trim(),
            about: $("#signup-about").val().trim(),
            img_url: $("#signup-img-url").val().trim()
        }
        $.ajax("/api/user", {
            type: "POST",
            data: newUser
        }).then(function () {
            console.log("User has been added.");
            location.reload();
        })

        $("#signup-username").val("");
        $("#signup-email").val("");
        $("#signup-password").val("");
        $("#signup-about").val("");
        $("#signup-img-url").val("");

    })

})