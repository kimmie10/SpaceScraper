//Get articles as json && display on page

    // for (var i = 0; i < data.length; i++) {
    //     $("#articles").append(`<p data-id= ${data[i]._id} > ${data[i].title} <br /> ${data[i].link} </p>`);
    // };

// $.getJSON("/articles", function (data) {
//     console.log(data);
// });

$(document).on("click", "p", function () {
    console.log(this);
     $("#comment").empty();

    const thisId = $(this).attr("{{data-id}}");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then((data) => {
            console.log(thisId);

            $("#comment").append("<h2>" + data.title + "</h2>");

            $("#comment").append("<input id='titleinput' name='title' >");

            $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");

            $("#comment").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {

                $("#titleinput").val(data.comment.title);

                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#savecomment", function () {

    const thisId = $(this).attr("{{data-id}}");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),

            body: $("#bodyinput").val()
        }
    })

        .then(function (data) {

            console.log(data);

            $("#comment").empty();
        });


    $("#titleinput").val("");
    $("#bodyinput").val("");
});