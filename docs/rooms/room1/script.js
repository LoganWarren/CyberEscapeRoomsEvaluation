// ===== CONFIG =====
let totalNumMinutes = 45; // EDIT THIS LINE TO CHANGE THE AMOUNT OF TIME

// EDIT THIS ARRAY TO ADD OR CHANGE VIDEOS (MUST BE IN ORDER)
// THE CODES MUST BE ENTERED IN THIS ORDER
const allCodes = [
  // Intro / Room Start
  { code: '{INITIAL}', url: 'https://www.youtube.com/embed/BUb4_GZgTRY' },

  // Puzzle Group 1
  { code: 'BOTNET', url: 'https://www.youtube.com/embed/TT0MXK2CDBE' },

  // Puzzle Group 2 – Security Questions (Q1–Q5)
  { code: 'SECURITY QUESTIONS', url: 'https://www.youtube.com/embed/CDVRLroNu8k' }, // Q1 prompt
  { code: 'BRUTE FORCE', url: 'https://www.youtube.com/embed/GM9lfRw8ahU' },      // Q2 prompt
  { code: 'STEGANOGRAPHY', url: 'https://www.youtube.com/embed/BE8Iy12kVEA' },    // Q3 prompt
  { code: 'OPEN SOURCE INTELLIGENCE', url: 'https://www.youtube.com/embed/hKwNQNw28u0' }, // Q4 prompt
  { code: 'PHISHING ATTACK', url: 'https://www.youtube.com/embed/YpMrqcGAU9A' },  // Q5 prompt

  // Ransomware / bridge step – still a Drive preview, that’s fine
  { code: 'RANSOMWARE'},

  // Script Blacklight / FINDHASH step – (you said no video needed, but if you keep a clip, embed it too or leave as Drive)
  { code: 'FINDHASH'},

  // WIN experience
  { code: 'SENDCASH', url: 'https://www.youtube.com/embed/dz38gQkC3m4' },

  // LOSS experience
  { code: '{LOSS}', url: 'https://www.youtube.com/embed/c93DhijZPAk' },
];


// Optional note: https://www.youtube.com/watch?v=TT0MXK2CDBE (not in array)

// ===== STATE =====
let currentVideo; // iframe element reference (set after DOM is ready)
let allSavedCodes = ['{INITIAL}'];
let endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
let gameState = 'menu';
let teamName = '';
let defeatReason = 'unset';
let numOfCodesEntered = 1;
let x = null; // timer interval handle

// ===== HELPERS (URL NORMALIZATION) =====
function toEmbed(url) {
  if (!url) return url;

  // YouTube: watch?v=..., youtu.be/ID, shorts/ID -> /embed/ID
  const ytWatch = url.match(/youtube\.com\/watch\?v=([^&#]+)/i);
  const youtuBe = url.match(/youtu\.be\/([^?&#/]+)/i);
  const ytShorts = url.match(/youtube\.com\/shorts\/([^?&#/]+)/i);
  if (ytWatch || youtuBe || ytShorts) {
    const id = (ytWatch && ytWatch[1]) || (youtuBe && youtuBe[1]) || (ytShorts && ytShorts[1]);
    let start = 0;
    try {
      const params = new URL(url).searchParams;
      start = params.get('t') || params.get('start') || 0;
    } catch(_) {}
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&start=${encodeURIComponent(start)}`;
  }

  // Google Drive: ensure /preview form
  const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  const driveOpen = url.match(/drive\.google\.com\/open\?id=([^&#]+)/i);
  const id = (driveFile && driveFile[1]) || (driveOpen && driveOpen[1]);
  if (id) return `https://drive.google.com/file/d/${id}/preview`;

  return url; // fallback
}

// ===== CORE LOGIC =====
function getIndexOfCode(code) {
  for (let i = 0; i < allCodes.length; i++) {
    if (allCodes[i].code === code) { return i; }
  }
  return -1;
}

function getCurrentCorrectCode() {
  return allCodes[numOfCodesEntered].code;
}

function updateVideo(code) {
  // Whenever a code is tried, hide safe hint by default
  var safeHint = document.getElementById('safe-hint');
  if (safeHint) safeHint.style.display = 'none';

  if (gameState === 'play' && (allSavedCodes.includes(code) || code === getCurrentCorrectCode() || code === '{LOSS}')) {
    var idx = getIndexOfCode(code);
    if (idx === -1) {
      playSound('incorrect');
      return;
    }

    // --- SPECIAL CASE A: RANSOMWARE -> show safe hint, no video change ---
    if (code === 'RANSOMWARE') {
      // Progress internal step count
      if (idx >= numOfCodesEntered) {
        numOfCodesEntered = idx + 1;
      }

      // Show the safe/key text under the video
      if (safeHint) safeHint.style.display = 'block';

      // Mark as correct
      playSound('correct');

      // Don't change the iframe src – last video stays on screen
      return;
    }

    // For all other codes, update the video as normal
    currentVideo.src = allCodes[idx].url;

    if (idx >= numOfCodesEntered) {
      numOfCodesEntered = idx + 1;
    }

    // --- SPECIAL CASE B: FINDHASH -> show hash/CrackStation text ---
    if (code === allCodes[8].code) {  // FINDHASH in your order
      var hashLink = document.getElementById('hash-link');
      if (hashLink) hashLink.style.display = 'block';
    }

    // --- WIN ---
    if (code === allCodes[9].code) { // SENDCASH
      gameState = 'win';
      clearInterval(x);
      playSound('win');
      document.getElementById('code-controls').style.display = 'none';
      document.getElementById('mission-controls').style.display = 'block';
      document.getElementById('hash-link').style.display = 'none';
      document.getElementById('clock').style.color = 'yellow';
      document.getElementById('clock').style.borderColor = 'yellow';

    // --- LOSS ---
    } else if (code === allCodes[10].code) { // {LOSS}
      gameState = 'loss';
      clearInterval(x);
      playSound('loss');
      defeatReason = defeatReason === 'unset' ? 'being stupid' : defeatReason;
      document.getElementById('code-controls').style.display = 'none';
      document.getElementById('mission-controls').style.display = 'block';
      document.getElementById('hash-link').style.display = 'none';
      document.getElementById('clock').style.color = 'red';
      document.getElementById('clock').style.borderColor = 'red';

    // --- Normal correct "ping" ---
    } else if (idx + 1 === numOfCodesEntered) {
      playSound('correct');
    }

    // --- SPECIAL CASE C: hide PG1 hint after BOTNET is solved ---
    if (code === 'BOTNET') {
      var pg1 = document.getElementById('puzzle-group1-hint');
      if (pg1) pg1.style.display = 'none';
    }

  } else {
    playSound('incorrect');
  }
}



function currentCode() {
  const entry = document.getElementById("code-entry").value.toUpperCase();

  if (
    entry === getCurrentCorrectCode() &&
    !allSavedCodes.includes(entry) &&
    entry !== '{default}' &&
    getIndexOfCode(entry) !== -1
  ) {
    allSavedCodes.push(entry);
    addVideoLink(entry);
    updateProgress(); // <-- update the progress bar/checklist
  }

  return entry;
}





function addVideoLink(code) {
  addElement('button', code, 'saved-codes', [['class', 'saved-vid-link'], ['onclick', 'updateVideo("'+code+'")']]);
}

function addElement(tag, content, parent, attributes) {
  var newElement = document.createElement(tag);
  for (var attr = 0; attr < attributes.length; attr++) {
    newElement.setAttribute(attributes[attr][0], attributes[attr][1])
  }
  newElement.innerHTML = content;
  var parentElement = document.getElementById(parent);
  parentElement.appendChild(newElement);
}

// Keep this (unused) function as-is to match your original file (it won’t run)
function correctCode(video) {
  let charString = '';
  if (video === 'initial') charString = allowedCodes[0];
  if (video === 'puzzle2') charString = allowedCodes[1];
  if (video === 'q1') charString = allowedCodes[2];
  if (video === 'q2') charString = allowedCodes[3];
  if (video === 'q3') charString = allowedCodes[4];
  if (video === 'q4') charString = allowedCodes[5];
  if (video === 'q5') charString = allowedCodes[6];
  if (video === 'puzzle3') charString = allowedCodes[7];
  if (video === 'win') charString = allowedCodes[8];
  if (video === 'loss') charString = allowedCodes[9];
  const correctSymbols = charString.split('-');
  let result = '';
  for (let i = 0; i < correctSymbols.length; i++) {
    result += chars[parseInt(correctSymbols[i])];
  }
  return result;
}

function addDefault() {
  // Cache the iframe reference now that DOM is ready
  currentVideo = document.getElementById("current-video");

  // Seed first link and load first video (normalized)
  addVideoLink('{INITIAL}');
  currentVideo.src = toEmbed(allCodes[0].url);
}

function padWithZero(num, targetLength) {
  return String(num).padStart(targetLength, '0');
}

function startEscapeRoom() {
  if (document.getElementById("pwd-entry").value.toUpperCase() === 'STARTCYBER') {
    teamName = document.getElementById("name-entry").value || 'Unnamed Team';
    endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'block';
document.getElementById("clock").innerHTML = '45:00';
    gameState = 'play';

            // NEW: show Puzzle Group 1 hint at the start
        var pg1 = document.getElementById('puzzle-group1-hint');
        if (pg1) pg1.style.display = 'block';

  } else {
    alert('Incorrect password. Please ask the escape room guide for the correct password.');
    return;
  }

  // Start / restart timer
  if (x) clearInterval(x);
  x = setInterval(function() {
    var now = new Date().getTime();
    var distance = endTime - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("clock").innerHTML = padWithZero(Math.max(minutes,0), 2) + ":" + padWithZero(Math.max(seconds,0), 2);
    if (distance < 0 && gameState === 'play') {
      clearInterval(x);
      document.getElementById("clock").innerHTML = "00:00";
      defeatReason = 'out of time';
      updateVideo('{LOSS}');
    }
  }, 500);
}

function playSound(sound) {
  if (sound === 'correct') new Audio('sound-correct.wav').play();
  if (sound === 'incorrect') new Audio('sound-incorrect.wav').play();
  if (sound === 'win') new Audio('sound-win.wav').play();
  if (sound === 'loss') new Audio('sound-loss.wav').play();
}

function showResultScreen() {
  var startNumSeconds = totalNumMinutes*60;
  var endTimeArr = document.getElementById('clock').innerHTML.split(':');
  var endNumSeconds = parseInt(endTimeArr[0]) * 60 + parseInt(endTimeArr[1]);
  var totalSeconds = Math.max(0, startNumSeconds - endNumSeconds);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  document.getElementById('team-text').innerHTML = 'Team: ' + teamName;
  if (gameState === 'win') {
    document.getElementById('time-text').innerHTML = 'Final Time: ' + padWithZero(minutes, 2) + ':' + padWithZero(seconds, 2);
  } else {
    document.getElementById('time-text').innerHTML = 'Defeat Reason: ' + defeatReason;
  }
  document.getElementById('result-screen').style.borderColor = gameState === 'win' ? 'lime' : 'red';
  document.getElementById('result-screen').style.color = gameState === 'win' ? 'lime' : 'red';
  document.getElementById('result-text').style.borderColor = gameState === 'win' ? 'lime' : 'red';
  document.getElementById('result-text').innerHTML = gameState === 'win' ? 'SUCCESS' : 'FAILURE';
  document.getElementById('main').style.display = 'none';
  document.getElementById('result').style.display = 'block';
}

function returnToMain() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  
}

// ---------------------------------------------------------------------------------------
// This is the update progress section
function updateProgress() {
    var steps = [
        'BOTNET',
        'SECURITY QUESTIONS',
        'BRUTE FORCE',
        'STEGANOGRAPHY',
        'OPEN SOURCE INTELLIGENCE',
        'PHISHING ATTACK',
        'RANSOMWARE',
        'FINDHASH',
        'SENDCASH'
    ];

    function mark(id, done) {
        var el = document.getElementById(id);
        if (!el) return;
        if (done) el.classList.add('done');
        else el.classList.remove('done');
    }

    mark('step-botnet', allSavedCodes.includes('BOTNET'));
    mark('step-sec-questions', allSavedCodes.includes('SECURITY QUESTIONS'));
    mark('step-q1', allSavedCodes.includes('BRUTE FORCE'));
    mark('step-q2', allSavedCodes.includes('STEGANOGRAPHY'));
    mark('step-q3', allSavedCodes.includes('OPEN SOURCE INTELLIGENCE'));
    mark('step-q4', allSavedCodes.includes('PHISHING ATTACK'));
    mark('step-q5', allSavedCodes.includes('RANSOMWARE'));
    mark('step-findhash', allSavedCodes.includes('FINDHASH'));
    mark('step-sendcash', allSavedCodes.includes('SENDCASH'));

    var doneCount = steps.filter(function(c) { return allSavedCodes.includes(c); }).length;
    var pct = Math.round(doneCount / steps.length * 100);

    var bar = document.getElementById('progress-bar-fill');
    var label = document.getElementById('progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = pct + '% complete';
}
