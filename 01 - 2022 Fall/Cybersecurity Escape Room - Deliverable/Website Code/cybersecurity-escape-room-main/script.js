// EDIT THIS LINE TO CHANGE THE AMOUNT OF TIME
totalNumMinutes = 30;

// EDIT THIS ARRAY TO ADD OR CHANGE VIDEOS
// THE CODES MUST BE ENTERED IN THIS ORDER
allCodes = [
    {
        code: '{INITIAL}',
        url: 'https://drive.google.com/file/d/1peqO1t_ldzy9vXB78e3mqyNcAvHRqPro/preview'
    },
    {
        code: 'BOTNET',
        url: 'https://drive.google.com/file/d/1k1E8CnrM-GvojkChj-vWLVj1dYx6TjUg/preview'
    },
    {
        code: 'SECURITY QUESTIONS',
        url: 'https://drive.google.com/file/d/1NZqJuUhLe73pGDTT3n_sp6b_oAWbWQkZ/preview'
    },
    {
        code: 'BRUTE FORCE',
        url: 'https://drive.google.com/file/d/1XCQyPjJOnisU32F7emi4RenslUf69fZK/preview'
    },
    {
        code: 'STEGANOGRAPHY',
        url: 'https://drive.google.com/file/d/1cyD33ZO63QYtyJhxQLBh8riZYhAABmYe/preview'
    },
    {
        code: 'OPEN SOURCE INTELLIGENCE',
        url: 'https://drive.google.com/file/d/1LRHMt6ER00aNPui9ruPODr-3rM0wL4Eq/preview'
    },
    {
        code: 'PHISHING ATTACK',
        url: 'https://drive.google.com/file/d/1_q4frXp6dALjiXtw_PVNfCVM1nfQa4WN/preview'
    },
    {
        code: 'RANSOMWARE',
        url: 'https://drive.google.com/file/d/1-edDwWaS87EzRg2Qf6C-ArULfDtiMHNG/preview'
    },
    {
        code: 'FINDHASH',
        url: 'https://drive.google.com/file/d/1-edDwWaS87EzRg2Qf6C-ArULfDtiMHNG/preview'
    },
    {
        code: 'SENDCASH',
        url: 'https://drive.google.com/file/d/1Gt22SR84L-bW6EouKESdUeTHmZeOLjZC/preview'
    },
    {
        code: '{LOSS}',
        url: 'https://drive.google.com/file/d/1Wubr9_BWhs6O-rkyC_Bh0tOz9GcFRQQY/preview'
    },
]

// DON'T EDIT ANYTHING BELOW HERE
currentVideo = document.getElementById("current-video");
allSavedCodes = ['{INITIAL}'];
endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
gameState = 'menu';
teamName = '';
clockShown = true;
defeatReason = 'unset';
numOfCodesEntered = 1;

function getIndexOfCode(code) {
    for (let i = 0; i < allCodes.length; i++) {
        if (allCodes[i].code === code) {return i;}
    }
    return -1;
}

function getCurrentCorrectCode() {
    return allCodes[numOfCodesEntered].code;
}

function updateVideo(code) {
    if (gameState === 'play' && (allSavedCodes.includes(code) || code === getCurrentCorrectCode() || code === '{LOSS}')) {
        currentVideo.src = allCodes[getIndexOfCode(code)].url;
        if (getIndexOfCode(code) >= numOfCodesEntered) {
            numOfCodesEntered = getIndexOfCode(code)+1;
        }
        if (code === allCodes[8].code) {
            document.getElementById('hash-link').style.display = 'block';
        } else if (code === allCodes[9].code) {
            gameState = 'win';
            clearInterval(x);
            playSound('win');
            document.getElementById('code-controls').style.display = 'none';
            document.getElementById('mission-controls').style.display = 'block';
            document.getElementById('hash-link').style.display = 'none';
            document.getElementById('clock').style.color = 'yellow';
            document.getElementById('clock').style.borderColor = 'yellow';
        } else if (code === allCodes[10].code) {
            gameState = 'loss';
            clearInterval(x);
            playSound('loss');
            defeatReason = defeatReason === 'unset' ? 'being stupid' : defeatReason;
            document.getElementById('code-controls').style.display = 'none';
            document.getElementById('mission-controls').style.display = 'block';
            document.getElementById('hash-link').style.display = 'none';
            document.getElementById('clock').style.color = 'red';
            document.getElementById('clock').style.borderColor = 'red';
        } else if (getIndexOfCode(code)+1 === numOfCodesEntered) {
            playSound('correct')
        }
    } else {
        playSound('incorrect');
    }
}

function currentCode() {
    if (document.getElementById("code-entry").value.toUpperCase() === getCurrentCorrectCode() && !allSavedCodes.includes(document.getElementById("code-entry").value.toUpperCase()) && document.getElementById("code-entry").value.toUpperCase() !== '{default}' && getIndexOfCode(document.getElementById("code-entry").value.toUpperCase()) !== -1) {
        allSavedCodes.push(document.getElementById("code-entry").value.toUpperCase());
        addVideoLink(document.getElementById("code-entry").value.toUpperCase());
    }
    return document.getElementById("code-entry").value.toUpperCase();
}

function addVideoLink(code) {
    addElement('button', code, 'saved-codes', [['class', 'saved-vid-link'], ['onclick', 'updateVideo("'+code+'")']]);
}

function addElement(tag, content, parent, attributes) {
	var newElement = document.createElement(tag);
	for (var attr = 0; attr < attributes.length; attr++)
	{
		newElement.setAttribute(attributes[attr][0], attributes[attr][1])
	}
	newElement.innerHTML = content;
	var parentElement = document.getElementById(parent);
	parentElement.appendChild(newElement);
}

function correctCode(video) {
    if (video === 'initial') {
        charString = allowedCodes[0];
    }
    if (video === 'puzzle2') {
        charString = allowedCodes[1];
    }
    if (video === 'q1') {
        charString = allowedCodes[2];
    }
    if (video === 'q2') {
        charString = allowedCodes[3];
    }
    if (video === 'q3') {
        charString = allowedCodes[4];
    }
    if (video === 'q4') {
        charString = allowedCodes[5];
    }
    if (video === 'q5') {
        charString = allowedCodes[6];
    }
    if (video === 'puzzle3') {
        charString = allowedCodes[7];
    }
    if (video === 'win') {
        charString = allowedCodes[8];
    }
    if (video === 'loss') {
        charString = allowedCodes[9];
    }
    correctSymbols = charString.split('-');
    result = '';
    for (let i = 0; i < correctSymbols.length; i++) {
        result += chars[parseInt(correctSymbols[i])];
    }
    return result;
}

function addDefault() {
    addVideoLink('{INITIAL}');
}

function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
}

function startEscapeRoom() {
    if (document.getElementById("pwd-entry").value.toUpperCase() === 'STARTCYBER') {
        teamName = document.getElementById("name-entry").value;
        endTime = new Date(new Date().getTime() + totalNumMinutes * 60000);
        document.getElementById('login').style.display = 'none';
        document.getElementById('main').style.display = 'block';
        document.getElementById("clock").innerHTML = '40:00';
        gameState = 'play';
    } else {
        alert('Incorrect password. Please ask the escape room guide for the correct password.');
    }
}

function playSound(sound) {
    if (sound === 'correct') {
        new Audio('sound-correct.wav').play();
    }
    if (sound === 'incorrect') {
        new Audio('sound-incorrect.wav').play();
    }
    if (sound === 'win') {
        new Audio('sound-win.wav').play();
    }
    if (sound === 'loss') {
        new Audio('sound-loss.wav').play();
    }
}

function showResultScreen() {
    var startNumSeconds = totalNumMinutes*60;
    var endTime = document.getElementById('clock').innerHTML.split(':');
    var endNumSeconds = parseInt(endTime[0])*60 + parseInt(endTime[1]);
    var totalSeconds = startNumSeconds - endNumSeconds;
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

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = endTime - now;
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("clock").innerHTML = padWithZero(minutes, 2) + ":" + padWithZero(seconds, 2);
  if (distance < 0 && gameState === 'play') {
    clearInterval(x);
    document.getElementById("clock").innerHTML = "00:00";
    defeatReason = 'out of time';
    updateVideo('{LOSS}');
  }
}, 500);