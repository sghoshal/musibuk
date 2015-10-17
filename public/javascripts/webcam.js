// Start Webcam

$("#btn-webcam-start").click(function(event) {
  $("#webcam").scriptcam({
    path: '/javascripts/scriptcam/',
    showDebug: true,
    promptWillShow: showMessage
  });
});

// Stop and Detach Webcam

$("#btn-webcam-stop").click(function(event) {
  $("#webcam").detach();
});

function showMessage() {
  alert("A security dialog. Please click ACCEPT");
}