var filters = [{
        name: "cuisines",
        filters: ["cuisine^cuisine-american", "cuisine^cuisine-kid-friendly", "cuisine^cuisine-italian", "cuisine^cuisine-asian", "cuisine^cuisine-mexican", "cuisine^cuisine-french", "cuisine^cuisine-southwestern", "cuisine^cuisine-barbecue-bbq", "cuisine^cuisine-indian", "cuisine^cuisine-chinese", "cuisine^cuisine-mediterranean", "cuisine^cuisine-greek", "cuisine^cuisine-english", "cuisine^cuisine-spanish", "cuisine^cuisine-thai", "cuisine^cuisine-german", "cuisine^cuisine-moroccan", "cuisine^cuisine-irish", "cuisine^cuisine-cuban", "cuisine^cuisine-hawaiian", "cuisine^cuisine-swedish", "cuisine^cuisine-hungarian", "cuisine^cuisine-portuguese"]
    },
    {
        name: "diets",
        filters: ["388^Lacto vegetarian", "389^Ovo vegetarian", "390^Pescetarian", "386^Vegan", "387^Lacto-ovo vegetarian", "403^Paleo"]
    },
    {
        name: "intolerances",
        filters: ["393^Gluten-Free", "394^Peanut-Free", "398^Seafood-Free", "399^Sesame-Free", "400^Soy-Free", "396^Dairy-Free", "397^Egg-Free", "401^Sulfite-Free", "395^Tree Nut-Free", "392^Wheat-Free"]
    }
];

var chosenFilters = [
    {
        name: "cuisines",
        filters: []
    },
    {
        name: "diets",
        filters: []  
    },
    {
        name: "intolerances",
        filters: []
    }
];

var chosenIngredients = [];


//function to show the returned recipes from the API in the results area using Jquery
function renderResults(res) {
    $("#results-area").empty();
    for (var i = 0; i < res.matches.length; i++) {
        var matches = res.matches[i];

        var div = $("<div>");
        div.addClass("result");

        var ul = $("<ul>");
        ul.attr("recipe-id", matches.id);

        var liImage = $("<li>");
        var image = $("<img>");
        image.attr("src", matches.smallImageUrls);
        liImage.append(image);

        var liName = $("<li>");
        liName.text("Name: " + matches.recipeName);

        var liRating = $("<li>");
        liRating.text("Rating: " + matches.rating);

        var liTime = $("<li>");
        liTime.text("Preparation Time: " + matches.totalTimeInSeconds + " minutes.");

        ul.append(liImage, liName, liRating, liTime);
        div.append(ul);
        $("#results-area").append(div);
    }
}

function renderRecipe(res) {
    $("#recipe-section").empty();

    console.log(res);

    var recipeName = res.name;
    var nameDiv = $("<div>");
    var nameH = $("<h4>");
    nameH.text(recipeName);
    nameDiv.append(nameH).addClass("recipe-name");

    var image = res.images[0].hostedLargeUrl;
    var imageDiv = $("<div>");
    var img = $("<img>");
    img.attr("src", image);
    imageDiv.append(img);

    var typeDiv = $("<div>");
    if (res.attributes.course) {
        var type = res.attributes.course[0];
        var typeP = $("<p>");
        typeP.text("This recipe is great for " + type);
        typeDiv.append(typeP);
    }

    var ingredients = res.ingredientLines;
    var ingredientsDiv = $("<div>");
    var ingredientsHeader = $("<h4>");
    ingredientsHeader.text("Ingredients:").addClass("recipe-modal-ingredients-header");
    ingredientsDiv.append(ingredientsHeader);
    var ingredientsUl = $("<ul>");
    for (var i = 0; i < ingredients.length; i++) {
        var ingredientLi = $("<li>");
        ingredientLi.text(ingredients[i]);
        ingredientsUl.addClass("recipe-modal-ingredients-content").append(ingredientLi);
    }
    ingredientsDiv.append(ingredientsUl);

    var servings = res.numberOfServings;
    var servingsDiv = $("<div>");
    var servingsP = $("<p>");
    servingsP.text("Serves " + servings);
    servingsDiv.append(servingsP);

    var rating = res.rating;
    var ratingDiv = $("<div>");
    var ratingP = $("<p>");
    ratingP.text("Rating: " + rating);
    ratingDiv.append(ratingP);

    var totalTime = res.totalTime;
    var timeDiv = $("<div>");
    var timeP = $("<p>");
    timeP.text("Takes about " + totalTime);
    timeDiv.append(timeP);

    var sourceRecipe = res.source.sourceRecipeUrl;
    var sourceDiv = $("<div>");
    var sourceA = $("<a>");
    sourceA.attr("href", sourceRecipe).attr("target", "_blank").text("Click here to get the instructions.");
    sourceDiv.append(sourceA);

    var recipeId = res.id;
    var favoritesDiv = $("<div>");
    var headerFav = $("<h3>");
    headerFav.text("Add this recipe to your favorites.");
    var heart = $("<i>");
    heart.addClass("fas fa-heart fa-3x");
    favoritesDiv.append(heart, headerFav).attr("recipe-id", recipeId).attr("id" , "add-fav");

    $("#recipe-section").append(nameDiv, imageDiv, typeDiv, ingredientsDiv, servingsDiv, ratingDiv, timeDiv, sourceDiv, favoritesDiv);
    $("#recipes-modal").show();
}


$(document).ready(function() {

        //  Event listener:  click to search for the query and arrays if they exist.   Sends ajax call to api/recipes route and returns an object
        $("#search-button").on("click", function (event) {
            event.preventDefault();
    
            var query = {
                query: $("#query").val().trim()
            };
            if (chosenIngredients.length > 0) {
                query.ingredients = chosenIngredients;
            }
            for (var i = 0; i < chosenFilters.length; i++){
                if (chosenFilters[i].filters.length > 0){
                    Object.defineProperty(query, chosenFilters[i].name, {
                        value: chosenFilters[i].filters,
                        enumerable: true
                      });
                }

            }
    
            $.ajax("/recipes/", {
                type: "POST",
                data: query
            }).then(function (response) {
                renderResults(response);
            });
            $("#query").val("");
        })

        $("#results-area").on("click", "ul", function (){
            var recipeId = $(this).attr("recipe-id");
    
            $.ajax(("/recipes/" + recipeId), {
                type: "GET"
            }).then(function (response) {
                renderRecipe(response);
            })
        })



})