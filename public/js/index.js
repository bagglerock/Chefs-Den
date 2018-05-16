//  Function to clean up the searchvalue string to be displayed as a button
function cleanSearchValue(str) {
    //  Find the string that follows the "^" character and set it as searchValueClean
    var regex = /(?<=\^)[\w+. -]+/;
    str = regex.exec(str);
    //  If the word starts with cuisine (ie. cuisine-american) then get rid of the cuisine part
    //  Note:  regex.exec(string) returns an array - element 0 is the found word
    if (str[0].startsWith("cuisine")) {
        //  regex:  take the value that follows "cuisine-"
        var cuisineRegex = /(?<=cuisine-)[\w+.-]+/;
        str = cuisineRegex.exec(str[0]);
        //  Make the first letter capital
        str = str[0].charAt(0).toUpperCase() + str[0].substring(1);
    }
    return str;
}

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
                var searchValueClean = cleanSearchValue(searchValue);
                button.addClass("filter-button " + filterName + "-button");
                button.attr("search-value", searchValue);
                button.text(searchValueClean);
                //check to see if this searchValue exists in the chosenFiltersSelected filterName array and addclass filter-selected if it is
                for (var k = 0; k < chosenFilters.length; k++) {
                    if (chosenFilters[k].name === filterName) {
                        var exists = chosenFilters[k].filters.includes(searchValue);
                        if (exists) {
                            button.addClass("filter-selected");
                        }
                    }
                }
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

function showFilters(){
    $("#filters-area").empty();
    for (var i = 0; i < chosenFilters.length; i++){
        if (chosenFilters[i].filters.length > 0){
            for (var j = 0; j < chosenFilters[i].filters.length; j++){
                var thisFilter = chosenFilters[i].filters[j];
                var button = $("<button>");
                button.text(cleanSearchValue(thisFilter)).addClass("filter-button fas fa-trash chosen-filter");
                button.attr("search-value", thisFilter);
                $("#filters-area").append(button);
            }
        }
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
    $("#filters-close").on("click", function () {
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
        if (query !== "") {
            chosenIngredients.push(query);
            showChosenIngredients();
            $("#query").val("");

        }
    })

    //  Event listener:  click to subtract ingredient from the ingredients array
    $("#ingredients-area").on("click", ".chosen-ingredient", function () {
        //remove this ingredient from the array
        var ingredient = $(this).text();
        var indexOfIngredient = chosenIngredients.indexOf(ingredient);
        chosenIngredients.splice(indexOfIngredient, 1);
        $("#ingredients-area").empty();
        showChosenIngredients();

    })

    //  Event listener: click to subtract filter from the filters array and remove from main view
    $("#filters-area").on("click", ".chosen-filter", function() {
        var searchValue = $(this).attr("search-value");
        for (var i = 0; i < chosenFilters.length; i++){
            if(chosenFilters[i].filters.includes(searchValue)){
                var theFiltersWithin = chosenFilters[i].filters;
                var indexOfChosenFilter = theFiltersWithin.indexOf(searchValue);
                    theFiltersWithin.splice(indexOfChosenFilter, 1);
                    showFilters();
            }
        }
    })

    //  Event listener:  Add the filter if the filter name is clicked, remove it if it already is in the array
    $("#filters-modal").on("click", ".filter-button", function () {
        //take the search value of the button
        var filterButtonName = $(this).attr("search-value");
        //take the classes added to this filter
        var filterButtonClasses = $(this).attr("class");
        //extract the type and set it to a variable, ie. (diets, intolerances, cuisines)
        var filterButtonType = filterButtonClasses.replace("filter-selected", "").replace("filter-button ", "").replace("-button", "");
        //trim off the space at the end (annoying bug)
        filterButtonType = filterButtonType.replace(" ", "");
        //for loop to go find a match in the corresponding type
        for (var i = 0; i < chosenFilters.length; i++) {
            //to help make it easier to read set chosenType to be the name of the type in the chosenFilters array
            var chosenType = chosenFilters[i].name;
            //if the chosenType is the same as the filterbuttonType then do either one of two things
            if (chosenType === filterButtonType) {
                //to make it easier to read set the array of filters chosen that is inside that other inside array(confused yet?)
                var theFiltersWithin = chosenFilters[i].filters;
                //if the filter exists in the chosenFilters array then take it out of the array
                if (theFiltersWithin.includes(filterButtonName)) {
                    var indexOfChosenFilter = theFiltersWithin.indexOf(filterButtonName);
                    theFiltersWithin.splice(indexOfChosenFilter, 1);
                    makeButtonsFor(filterButtonType);
                    //if the filter doesnt exist in the chosenFilters array then add it to the array
                } else {
                    theFiltersWithin.push(filterButtonName);
                    makeButtonsFor(filterButtonType);
                }
            }
        }
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

    $("#recipes-modal").on("click", "#add-fav", function() {
        console.log($(this).attr("recipe-id"));
    })

})