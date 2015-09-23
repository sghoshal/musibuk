$( "#bpmInputForm" ).submit(function(event) {
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page.
    var $form = $(this),
        bpmInput = $form.find("input[name='setBpm']").val(),
        exerciseId = $form.find("input[name='exId']").val(),

        url = $form.attr("action");

        var posting = $.post(url, { 
            bpm: bpmInput,
            exerciseId: exerciseId
        });

        posting.done(function( data ) {
            $("#bpmText").html(data);
        });
});