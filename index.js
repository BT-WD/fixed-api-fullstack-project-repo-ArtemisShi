const url = "https://bored-api.appbrewery.com/random"
const startPage = document.getElementById("start-page");
const promptPage = document.getElementById("prompt-page");
const playPage = document.getElementById("play-page");
const endPage = document.getElementById("end-page");
const users = [];
const points = [];
const usernames = [];
const nextBtn = document.getElementById("next-btn");
const usernameInput = document.getElementById("username-input");
const doneBtn = document.getElementById("done-btn");
const verdictEl = document.getElementById("verdict-el");
const promptEl = document.getElementById("prompt-data");

const getPrompt = async () => {
    try {
        let response = await fetch(url);
        if(response.ok){
            let jsonResponse = await response.json();
            return jsonResponse.activity;
      }
  } catch (error) {
    console.log(error);
  }
}

function pickPlayers() {
  usernameInput.style.visibility = "visible";
  doneBtn.style.visibility = "visible";
}

async function startGame() {
    startPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "none";
    promptPage.style.display = "block";
    activity = await getPrompt();
    promptEl.textContent = activity || "Failed to load activity. Try again!";
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
    verdictEl.textContent = "False"
  }

  function voteTrue(){

  }

  function voteFalse(){

  }