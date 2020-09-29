// Image store
pictures = []

// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Define constants
const cameraView = document.querySelector("#camera--view"),
      cameraTrigger = document.querySelector("#camera--trigger");

      const confirm = document.getElementById("confirm");
      confirm.disabled = true;

// Access the device camera and stream to cameraView
function cameraStart() {

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
        }

var outputcanvas = document.getElementById("output");
var countdown = document.getElementById("countdown");
var time = 10;


function takepic(){

    outputcanvas.width = cameraView.videoWidth  ;
    outputcanvas.height = cameraView.videoHeight  ;
    
    outputcanvas.getContext("2d").translate(outputcanvas.width, 0);
    outputcanvas.getContext("2d").scale(-1, 1);

    outputcanvas.getContext("2d").drawImage(cameraView, 0, 0);

    
    confirm.disabled = false;
    document.getElementById('output').scrollIntoView();
}
  
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    document.getElementById('countdown').scrollIntoView();
    var intv = setInterval(function() {
        countdown.innerHTML=time;
        time--;
        if(time == -1){
            takepic();
            clearInterval(intv);
            time = 10;
            countdown.innerHTML=time;
        }
      }
        , 1000);
    
};

// Clear output canvas if redo is clicked
const redo = document.getElementById("redo").addEventListener("click",()=>{
    var outputctx =  outputcanvas.getContext("2d");
    outputctx.clearRect(0, 0, outputcanvas.width, outputcanvas.height);
    time = 10;
    confirm.disabled = true;
    document.getElementById('camera--view').scrollIntoView();
});

// Save Image if confirm is clicked
confirm.addEventListener("click",downloadPNG);


function downloadPNG() {
    time=10;

    var link = document.createElement('a');
    link.download = 'smartfit.png';
    link.href = outputcanvas.toDataURL()
    link.click();
    //return Canvas2Image.saveAsJPG(outputcanvas);
}


// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

