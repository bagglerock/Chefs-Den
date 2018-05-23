$(document).ready(function(){


    //  Event listener:  click to send login information
    var loginForm = $("form#login-form");
    var userName = $("input#login-username");
    var password = $("input#login-password");
    

    // When the form is submitted, we validate there's an username and password entered
    loginForm.on("submit", function (event) {
        event.preventDefault();

        var loginInfo = {
            userName: userName.val().trim(),
            password: password.val().trim()
        }
        if (!loginInfo.userName || !loginInfo.password) {
            return;
        } 
        loginUser(loginInfo.userName, loginInfo.password);
        $("#login-username").val("");
        $("#login-password").val("");
    });

    function loginUser(userName, password){
        $.post("/api/login", {
            userName: userName,
            password: password
        }).then(function(data){
            $("#login-modal").hide();
            $("#logged-in-divs").show();
            window.location.assign("/profile/");
        }).catch(function(err){
            console.log(err);
            $("#login-error").text("Username does not exist");
        });
    }
    //  Event listener:  click to send signup information

    var signUpForm = $("form#signup-form");
    var userNameInput = $("input#signup-username");
    var emailInput = $("input#signup-email");
    var passwordInput = $("input#signup-password");
    var aboutInput = $("textarea#signup-about");

    signUpForm.on("submit", function (event) {
        event.preventDefault();
        // Use FormData constructor to build a new multipart form (for handling images)
        var formData = new FormData();
        // append username to form (email: 'alex@alex.com')
        formData.append("userName", userNameInput.val().trim());
        // append password to form (password: '12345')
        formData.append("password", passwordInput.val().trim());
        // append email to form (password: '12345')
        formData.append("email", emailInput.val().trim());
        // append about me to form (password: '12345')
        formData.append("about", aboutInput.val().trim());
        console.log(aboutInput.val());

        if ($("#signup-img-url").prop("files")[0]) {
            // append photo information to form (photo: {objOfPhotoInfo})
            formData.append("photo", $("#signup-img-url").prop("files")[0], $("#signup-img-url").prop("files")[0].name);
        }
        console.log($("#signup-img-url").prop("files"));

        // If we have an email and password, run the signUpUser function
        signUpUser(formData);
        userNameInput.val("");
        passwordInput.val("");
        emailInput.val("");
        aboutInput.val("");
    });

    // Does a post to the signup route. If successful, we are redirected to the favorites page
    // Otherwise we log any errors
    function signUpUser(formData) {
        $.ajax({
            url: "/api/user",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
        }).then(function (data) {
            console.log(data);
            $("#sign-up-modal").hide();
            window.location.assign("/profile/");

            // If there's an error, handle it by throwing up alert
        }).catch(function(err){
            $("#sign-up-modal").show();
            $("#signup-error").text("Username already in use");
        });
    }
})