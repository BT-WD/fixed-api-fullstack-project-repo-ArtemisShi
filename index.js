const url = "https://bored-api.appbrewery.com/random"
const startPage = document.getElementById("start-page");
const promptPage = document.getElementById("prompt-page");
const playPage = document.getElementById("play-page");
const endPage = document.getElementById("end-page");
const points = [];
const usernames = [];
const nextBtn = document.getElementById("next-btn");
const usernameInput = document.getElementById("username-input");
const doneBtn = document.getElementById("done-btn");
const verdictEl = document.getElementById("verdict-el");


const getPrompt = async () => {
    try {
        let response = await fetch(url);
        if(response.ok){
            let jsonResponse = await response.json();
            let genres = jsonResponse.genres;
            return genres;
      }
  } catch (error) {
    console.log(error);
  }
}

function pickPlayers() {
  usernameInput.style.visibility = "visible";
  doneBtn.style.visibility = "visible";
}

function startGame() {
    startPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "none";
    promptPage.style.display = "block";
  }

  function play() {
    startPage.style.display = "none";
    playPage.style.display = "block";
    endPage.style.display = "none";
    promptPage.style.display = "none";
    nextBtn.style.visibility = "hidden";
  }

  function confirmStatement() {
    startPage.style.display = "none";
    playPage.style.display = "block";
    promptPage.style.display = "none";
    nextBtn.style.visibility = "visible";
    verdictEl.textContent = "True"
  }
    
  function deconfirm() {
    startPage.style.display = "none";
    playPage.style.display = "block";
    promptPage.style.display = "none";
    nextBtn.style.visibility = "visible";
    verdict = "False"
  }

  function voteTrue(){

  }

  function voteFalse(){

  }