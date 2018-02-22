// Grab the articles as a json
// $.getJSON("/thoughts", function (data) {

// });
$(document).on("click", "#list", function () {
    $.ajax({
        method: "GET",
        url: "/thoughts"
    })
    .then(function(data) {
        console.log(data);
        $("#thoughts").empty();
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#thoughts").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='https://www.reddit.com" + data[i].link + "'><button class='btn-primary'>Comments</button></a></p>");
        }
        
    })

});

//Perform the scrape by clicking the Scraper button
$(document).on("click", "#scraper", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function () {
        $.ajax({
            method: "GET",
            url: "/thoughts"
        })
            // With that done, add the note information to the page
            .then(function (data) {
                $("#thoughts").empty();
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    // Display the apropos information on the page
                    $("#thoughts").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='https://www.reddit.com" + data[i].link + "'><button class='btn-primary'>Comments</button></a></p>");
                }
            });
    });
})




// // When you click the savenote button
// $(document).on("click", "#savenote", function () {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             // Value taken from title input
//             title: $("#titleinput").val(),
//             // Value taken from note textarea
//             body: $("#bodyinput").val()
//         }
//     })
//         // With that done
//         .then(function (data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });
