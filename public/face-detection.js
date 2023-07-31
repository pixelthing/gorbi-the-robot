var image = document.getElementById('imageTag');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var ctx = canvas.getContext('2d');
var scale = 1;
var wait = false;

// listen for the image to be captured from the camera
document.addEventListener('imageReady',function() {
  ctx.drawImage(image,
              0, 0, image.width, image.height,
              0, 0, canvas.width, canvas.height);

  scale = canvas.width / image.width;
  // run face detection
  window.requestAnimationFrame(function() {
    window.requestAnimationFrame(detect);
  });
});

function detect() {
  if (window.FaceDetector == undefined) {
    alert('Face Detection not supported. You\'ll need Chrome 58 or later and to enable chrome://flags/#enable-experimental-web-platform-features');
    return;
  }
        
  function compareArea(a,b) {
    if (a.gorbiArea < b.gorbiArea)
      return 1;
    if (a.gorbiArea > b.gorbiArea)
      return -1;
    return 0;
  }

  var faceDetector = new FaceDetector();
  faceDetector.detect(image)
    .then(faces => {
    
      // if no faces, trigger undirection and wait until we seen faces again
      if (!wait && !faces.length) {
        
          wait = true;
          // tell face detection to do it's thing
          var emptyEvent = new CustomEvent('tiltEmpty', {detail: {status: true}});
          document.dispatchEvent(emptyEvent);
          console.log('trigger empty');
          return;
        
      // else if there are faces
      } else if (faces.length) {
        
        wait = false;
        // calc the area of all the faces
        for(let face of faces) {
          if (face && face.boundingBox) {
            const box = face.boundingBox;
            face.gorbiArea = box.width * box.height;
          }
        }
        faces.sort(compareArea);
        // take the biggest (hopefully closest) face
        var frontFace = faces[0];
        // the midpoint of the face?
        var frontFaceMid = frontFace.boundingBox.x + frontFace.boundingBox.width/2;
        var frontFacePerc = frontFaceMid/canvas.width;
        // trigger the direction of the face
        var tiltEvent = new CustomEvent('tilt', {detail: {position: frontFacePerc}});
        document.dispatchEvent(tiltEvent);
    
        // /* PAINT SQUARES */
        // clear canvas
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        // Draw the faces on the <canvas>.
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        for(var i = 0; i < faces.length; i++) {
          const face = faces[i];
          if (face && face.boundingBox) {
            ctx.rect(Math.floor(face.boundingBox.x),
                     Math.floor(face.boundingBox.y),
                     Math.floor(face.boundingBox.width),
                     Math.floor(face.boundingBox.height));
            ctx.stroke();
          }
        }
        
      }
    })
    .catch((e) => {
      console.error("Face Detection failed on a then/catch: " + e);
    });
}