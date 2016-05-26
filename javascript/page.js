window.onload = function() {
  var canvasCircles = ["a", "b", "c", "d", "e"];
  var numQuestions = 5;

  // If we are on the results page, we want to draw the results circles
  if (window.location.href.search("results") !== -1) {
    for(var i = 0; i < canvasCircles.length; i++) {
      var canvasId = "canvas-circle-" + canvasCircles[i].toUpperCase();
      drawCircle(canvasId, answerProportion(canvasCircles[i]));
      writePercentagesForCirclesInAltTextField(canvasId);
    }
  }
  // If we are on a survey page, we want to draw the progress bar and hide
  // either the "Finish" button, or the "Next" button
  else if (window.location.href.search("survey") !== -1) {
    var progressId = "canvas-progress-bar";
    drawProgressBar(progressId, progressProportion(numQuestions));
    writePercentageForProgressBarAltTextField(progressId, numQuestions);
    hideSurveyButton(numQuestions);
  }
  else if (window.location.href.search("welcome") !== -1) {
    var headers = [
      "I am going to eat your family.",
      "I value our friendship.",
      "Release your inhibitions.",
      "When you're a Jet, you're a Jet all the way.",
      "Hell hath no fury because it doesn't exist.",
      "Where's Waldo? Uranus.",
      "Don't dream it, be it.",
      "I invented the piano-key necktie!",
      "Do you see what happens when you fight a stranger in the Alps?",
      "What was that noise behind you? o.o",
      "Forgiveness... can you imagine?",
      "Neither can live while the other survives.",
      "One day, the last Belieber will die.",
      "Wars are made and somehow that is wisdom.",
      "#blessed"
    ];
    var header = headers[Math.floor(Math.random()*headers.length)];
    document.getElementById("ph1").textContent = header;
  }
}

//
// Draw the green circles on the results page.
//
function drawCircle(circleId, proportion) {
  // Initialize the canvas and context for the circle
  var canvas = document.getElementById(circleId);
  var ctx = canvas.getContext("2d");

  // Get data from the HTML (use width instead of an assumed value to determine
  // where the center is)
  var text = canvas.getAttribute("textValue").toUpperCase();
  var width = canvas.getAttribute("width");

  // Set common factors for the circles
  ctx.lineCap = "round";
  ctx.lineWidth = 12.0;
  
  // Draw gray circle
  ctx.strokeStyle = "#EEEEEE";
  ctx.beginPath();
  ctx.arc(width/2, width/2, (width - ctx.lineWidth)/2, -0.5 * Math.PI, 2 * Math.PI - (0.5 * Math.PI), false);
  ctx.stroke();

  // Draw green circle
  ctx.strokeStyle = "#00FF00";
  ctx.beginPath();
  ctx.arc(width/2, width/2, (width - ctx.lineWidth)/2, -0.5 * Math.PI, Math.PI * 2 * proportion - (0.5 * Math.PI), false);
  ctx.stroke();

  // Add text inside the circle
  var fontSize = width - (2 * ctx.lineWidth);
  ctx.font = "100 " + fontSize + "px Droid Sans";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  var xVal = width/2;
  var yVal = width - 2*ctx.lineWidth;
  // Hacks to make some letters look better
  if (text === "C") { xVal -= ctx.lineWidth/2; }
  if (text === "D") { xVal += ctx.lineWidth/4; }
  if (text === "E") { xVal -= ctx.lineWidth/4; }
  ctx.fillText(text, xVal, yVal);

  // Lastly, just for looks, add percentage underneath
  fontSize = fontSize/5;
  ctx.font = "100 " + fontSize + "px Droid Sans";
  ctx.textBaseline = "hanging";
  ctx.fillText((proportion * 100) + "%", width/2, width)
}

//
// Draw the green progress bar below the survey.
//
function drawProgressBar(progressId, proportion) {
  // Initialize the canvas and context for the circle
  var canvas = document.getElementById(progressId);
  var ctx = canvas.getContext("2d");

  // Get data from the HTML
  var trueHeight = canvas.getAttribute("height");
  var width = canvas.getAttribute("width");
  var height = trueHeight * 2/3;

  // Set common factors
  ctx.lineCap = "round";
  ctx.lineWidth = height;
 
  // draw gray line, then green
  ctx.strokeStyle = "#EEEEEE";
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width * proportion, height/2);
  ctx.stroke();

  // add a dark border
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#202020";
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.stroke();

  // Add text below
  var fontSize = trueHeight - height - 2;
  ctx.font = "100 " + fontSize + "px Droid Sans";
  (proportion === 1) ? ctx.textAlign = "right" : ctx.textAlign = "left";
  ctx.textBaseline = "hanging";
  var xVal = width * proportion;
  var yVal = height + 2;
  ctx.fillText((proportion * 100) + "%", xVal, yVal);
}

//
// Get the proportion of questions for which we answered, say, "a".
// Note, we could refactor this to only iterate over the parameters once, but
// this works for now.
//
function answerProportion(answer) {
  var params = getUrlVars();
  var total = 0;
  var count = 0;
  for (var param in params) {
    total += 1;
    if (params[param] === answer) {
      count += 1;
    }
  }
  return Math.round((count / total) * 100) / 100;
}

//
// Find out what proportion of questions we have answered
//
function progressProportion(numQuestions) {
  var numParams = Object.keys(getUrlVars()).length;
  return Math.round((numParams / numQuestions) * 100) / 100;
}

//
// Fill in alternative text so that if the canvas elements do not load, there
// will still be useful text.
//
function writePercentagesForCirclesInAltTextField(canvasId) {
  var canvasElement = document.getElementById(canvasId);
  var percentage = answerProportion(canvasElement.getAttribute("textValue")) * 100;
  var text = ", " + percentage + "%";
  canvasElement.innerHTML += text;
}

//
// Fill in alternative text for the progress bar.
//
function writePercentageForProgressBarAltTextField(progressId, numQuestions) {
  var progressBar = document.getElementById(progressId);
  var percentage = progressProportion(numQuestions) * 100;
  var text = ": " + percentage + "%";
  progressBar.innerHTML += text;
}

function hideSurveyButton(numQuestions) {
  if (progressProportion(numQuestions) >= (numQuestions - 1) / numQuestions) {
    document.getElementById("next-button").style.display = "none";
  }
  else {
    document.getElementById("finish-button").style.display = "none";
  }
}   

//
// Have some basic information come up when a user clicks on a result.
//
function resultsPopover(answerChoice) {
  var params = getUrlVars();
  var questions = "";
  for (param in params) {
    if (params[param] === answerChoice) {
      (questions === "") ? questions = param : questions += ", " + param;
    }
  }
  var message = "Questions that were answered with " + answerChoice.toUpperCase() + ": " + questions;
  if (questions === "") { message = "No questions with " + answerChoice.toUpperCase(); }
  alert(message);
}

//
// NOTE non-standard, parameters should be handled by a controller and then
// passed into the view from there, not hacked in using javascript.
//
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) { vars[key] = value; });
  return vars;
}
