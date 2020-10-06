
// *********** PIC 1 stuff *********
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
var outputdummy = document.getElementById("outputdummy");
outputdummy.getContext("2d").translate(outputdummy.width, 0);
outputdummy.getContext("2d").scale(-1, 1);

var countdown = document.getElementById("countdown");
var time = 10;

   
// Function that scales Image on canvas
var fitImageOn = function(canvas, imageObj) {
	var imageAspectRatio = imageObj.width / imageObj.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	var renderableHeight, renderableWidth, xStart, yStart;
    var context = canvas.getContext('2d');
	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (canvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (canvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
    }
    
	context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
};

function takepic(){

    outputcanvas.width = cameraView.videoWidth  ;
    outputcanvas.height = cameraView.videoHeight ;
    
    outputcanvas.getContext("2d").translate(outputcanvas.width, 0);
    outputcanvas.getContext("2d").scale(-1, 1);

    outputcanvas.getContext("2d").drawImage(cameraView, 0, 0);

    fitImageOn(outputdummy, cameraView);
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
            confirm.disabled = false;
        }
      }
        , 1000);
    
};

// Clear output canvas if redo is clicked
const redo = document.getElementById("redo").addEventListener("click",()=>{
    var outputctx =  outputcanvas.getContext("2d");
    outputctx.clearRect(0, 0, outputcanvas.width, outputcanvas.height);

    var outputdummyctx =  outputdummy.getContext("2d");
    outputdummyctx.clearRect(0, 0, outputdummy.width, outputdummy.height);

    time = 10;
    confirm.disabled = true;
    document.getElementById('camera--view').scrollIntoView();
});

// Save Image if confirm is clicked
confirm.addEventListener("click",downloadJPG);


function downloadJPG() {
    time=10;
    var link = document.createElement('a');
    link.download = 'smartfit.png';
    link.href = outputcanvas.toDataURL()
    link.click();
    //return Canvas2Image.saveAsJPG(outputcanvas);
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

