
const gorbi =  (function() {
  
    const $face = document.querySelector('main');  
    const pixelX = 20;
    const pixelY = 15;
    const pixelCount = pixelX*pixelY;
    let   sequenceSet = null;
    let   sequenceTimer = null;
    let   sequenceIndex = 0;
    let   frameIndex = 0;
    let   tilting = false;
    const maxLoops = 2;
    let   loop = 0;
    let   loopDirection = 1; // start forward
    
    const init = function() {
      sequenceSet = faceList;
      buildSequenceFrame(0, 0, true);
      registerEvents();
      fullScreen();
    };
    
    const registerEvents= function() {
      document.querySelector('main').addEventListener('click',runSequence);
      document.addEventListener('tilt',directFrame);
      document.addEventListener('tiltEmpty',unDirect);
    };
    
    const fullScreen = function() {
      var goFS = document.getElementById("goFS");
      goFS.addEventListener("click", function() {
        toggleFullScreen();
      }, false);
    };
    
    function toggleFullScreen() {
      var doc = window.document;
      var docEl = doc.documentElement;
  
      var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
      if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      }
      else {
        cancelFullScreen.call(doc);
      }
    }
    
    const runSequence = function(sequenceOverride) {
      
      if (sequenceOverride && typeof sequenceOverride !== 'object') {
        sequenceSet = sequenceOverride;
      } else {
        sequenceSet = faceList;
      }
      
      clearTimeout(sequenceTimer);
      sequenceIndex++;
      if (sequenceIndex >= sequenceSet.length) {
          sequenceIndex = 0;
      }
      loop = 0;
      buildSequenceFrame( sequenceIndex, false, true);
      
    };
    
    const wipeSmile = function() {
      $face.innerHTML = '';
    }
    
    function buildSequenceFrame( sequenceIndex, frameIndexOverride, runLoop ) {
      
        console.log(tilting + ' : ' + frameIndexOverride)
      
      if (frameIndexOverride) {
        frameIndex= frameIndexOverride;
      }
  
      const sequence = sequenceSet[sequenceIndex];
      const face = (sequence[frameIndex] ? sequence[frameIndex].face : sequence[0].face  );
      const duration = sequence[frameIndex].duration;
  
        // build the face for this frame
        buildFace(face);
  
        // if the loop has returned to zero, turn it around and increase the loop counter
        if (loopDirection === 0 && frameIndex === 0) {
          loopDirection = 1;
          loop++;
          // if this is the max amount of loops, exit here.
          if (loop >= maxLoops) {
            clearTimeout(sequenceTimer);
            runSequence();
            return;
          }
          frameIndex++;
        // else if we're at the max, turn it around
        } else if (frameIndex === sequence.length - 1) {
          loopDirection = 0;
          frameIndex--;
        // otherwise - if the count is in the middle - increment the counter based on the direction
        } else if (loopDirection === 1) {
          frameIndex++;
        } else {
          frameIndex--;
        }
  
        if (runLoop && !tilting) {
          //console.log('runloop' + frameIndex + ':' + duration)
          // wait the require amount of time, then progress to the next frame
          sequenceTimer = setTimeout(function() {
              buildSequenceFrame( sequenceIndex, frameIndex, runLoop );
          },duration);
        }
  
    }
    
    const directFrame = function(ev) {
      tilting = true;
      const position = ev.detail.position;
      for(var i=2; i<=sequenceSet[sequenceIndex].length+2; i++) {
        const upperLimit = (1/(sequenceSet[sequenceIndex].length+2) * i);
        if (position < upperLimit) {
          buildSequenceFrame( sequenceIndex, i - 2 );
          break;
        }
      }
      
    };
    
    // can't see any faces, go to sad face, then start looping again.
    const unDirect = function(ev) {
      //console.log('xxx')
      tilting = false;
      runSequence()
    };
    
    const buildFace = function(face) {
      
      face = faceFlatten(face);
      const pixelArray = face.split('');
      
      wipeSmile();
        
      let countN  = 0;
      let countX  = 1;
      let countY  = 1;
      
      for(let pixel of pixelArray) {
          
        if (pixel === '0') {
          
          let $dot = document.createElement('SPAN');
          $dot.classList.add('dot');
          $dot.style.gridColumn = countX;
          $dot.style.gridRow = countY;
          $face.appendChild($dot);
  
        }
  
        countX++;
  
        // resets
        if (countX === pixelX) {
          countX = 0;
          countY++;
        }
        
      }
      
    };
    
    const faceFlatten = function(face) {
      if (!face) {
          return;
      }
      return face.replace(/(\r\n|\n|\r|\s)/gm,"");
    };
    
    const faceSmileBig1 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 - - 0 0 - - 0 0 0 0 - - 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - 0 - - - - - - - - 0 - - - - - 
   - - - - - - 0 0 0 0 0 0 0 0 - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBig2 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - 0 0 0 - - - 0 0 - - 0 0 0 - - - 0 0 - 
   - 0 0 0 - - - 0 0 - - 0 0 0 - - - 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - 0 - - - - - - - - 0 - - - - - 
   - - - - - - 0 0 0 0 0 0 0 0 - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBig3 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - 0 0 - - - - 0 0 - - 0 0 - - - - 0 0 - 
   - 0 0 - - - - 0 0 - - 0 0 - - - - 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - 0 - - - - - - - - - - 0 - - - - 
   - - - - - 0 0 0 0 0 0 0 0 0 0 - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBig4 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - 0 0 - - - 0 0 0 - - 0 0 - - - 0 0 0 - 
   - 0 0 - - - 0 0 0 - - 0 0 - - - 0 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - 0 - - - - - - - - - - 0 - - - - 
   - - - - - 0 0 0 0 0 0 0 0 0 0 - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBig5 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 0 - - 0 0 0 0 - - 0 0 - - 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 - - - - - - - - - - 0 0 - - - 
   - - - - 0 0 0 0 0 0 0 0 0 0 0 0 - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBig6 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 - - - - - - - - - - 0 0 - - - 
   - - - - 0 0 0 0 0 0 0 0 0 0 0 0 - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceSmileBigSeq = [
      {
        'face': faceSmileBig1,
        'duration': 1000
      },
      {
        'face': faceSmileBig2,
        'duration': 100
      },
      {
        'face': faceSmileBig3,
        'duration': 100
      },
      {
        'face': faceSmileBig4,
        'duration': 100
      },
      {
        'face': faceSmileBig5,
        'duration': 2000
      },
      {
        'face': faceSmileBig6,
        'duration': 100
      },
    ];
    
    const faceUnsure1 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 - - 0 0 - - 0 0 0 0 - - 0 0 - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsure2 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 0 - - 0 0 - - 0 0 0 0 - - 0 0 - 
   - 0 0 0 0 - - 0 0 - - 0 0 0 0 - - 0 0 - 
   - 0 0 0 0 - - 0 0 - - 0 0 0 0 - - 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsure3 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsure4 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 - - 0 0 0 0 - - 0 0 - - 0 0 0 0 - 
   - 0 0 - - 0 0 0 0 - - 0 0 - - 0 0 0 0 - 
   - 0 0 - - 0 0 0 0 - - 0 0 - - 0 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsure5 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 0 - - 0 0 0 0 - - 0 0 - - 0 0 0 0 - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsure6 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceUnsureSeq = [
      {
        'face': faceUnsure1,
        'duration': 1000
      },
      {
        'face': faceUnsure2,
        'duration': 100
      },
      {
        'face': faceUnsure3,
        'duration': 100
      },
      {
        'face': faceUnsure4,
        'duration': 100
      },
      {
        'face': faceUnsure5,
        'duration': 2000
      },
      {
        'face': faceUnsure6,
        'duration': 100
      }
    ];
    
    const faceCool1 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 - - - 0 - - 0 0 0 0 - - - 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCool2 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 - - - 0 0 - - 0 0 0 - - - 0 0 - 
   - 0 0 0 - - - 0 0 - - 0 0 0 - - - 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCool3 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - 0 0 0 - - 0 0 0 - - 0 0 0 - - 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCool4 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 - - - 0 0 0 - - 0 0 - - - 0 0 0 - 
   - 0 0 - - - 0 0 0 - - 0 0 - - - 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCool5 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 - - - 0 0 0 0 - - 0 - - - 0 0 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCool6 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 0 0 0 0 - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - `;
    
    const faceCoolSeq = [
      {
        'face': faceCool1,
        'duration': 1000
      },
      {
        'face': faceCool2,
        'duration': 100
      },
      {
        'face': faceCool3,
        'duration': 100
      },
      {
        'face': faceCool4,
        'duration': 100
      },
      {
        'face': faceCool5,
        'duration': 2000
      },
      {
        'face': faceCool6,
        'duration': 100
      }
    ];
    
    const faceSad1 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - 0 0 - - 0 0 0 - - - - - - 
   - 0 0 0 - - - 0 0 - - 0 0 0 - - - 0 0 - 
   - 0 0 0 0 0 0 0 0 - - 0 0 0 0 0 0 0 0 - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - - - 0 0 0 0 - - - - - - 0 0 0 0 - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - 0 0 0 0 0 0 0 0 0 0 0 0 - - - - 
   - - - 0 0 - - - - - - - - - - 0 0 - - -
   - - - - - - - - - - - - - - - - - - - -  `;
    
    const faceSad2 = `
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - 0 0 0 0 0 0 - - - - 0 0 0 0 0 0 - - 
   - 0 - - - - - - 0 - - 0 - - - - - - 0 - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - - - - - - - - - - - - - - - - - 
   - - - - 0 0 0 0 0 0 0 0 0 0 0 0 - - - - 
   - - - 0 0 - - - - - - - - - - 0 0 - - -
   - - - - - - - - - - - - - - - - - - - -  `;
    
    
    const faceSadSeq = [
      {
        'face': faceSad1,
        'duration': 2000
      },
      {
        'face': faceSad2,
        'duration': 200
      }
    ];
    
    const faceList = [
      faceSmileBigSeq,
      faceUnsureSeq,
      faceCoolSeq
    ];
    
    const sadList = [
      faceSadSeq
    ];
    
    return {
      init: init()
    }
    
  })();