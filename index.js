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
const user1 = document.getElementById("username1-input");
const user2 = document.getElementById("username2-input");
const user3 = document.getElementById("username3-input");
const user4 = document.getElementById("username4-input");
const user5 = document.getElementById("username5-input");
const playersEl = document.getElementById("players");

  for (let i =1; i< 6; i++) {
    let option = document.createElement("option");
    option.text = i;
    playersEl.appendChild(option);
  }

const getPrompt = async () => {
    try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log("Data received:", data);
            return data.activity; 
        } else {
            console.error("Server returned an error");
            return null;
        }
    } catch (error) {
        console.error("Network or Fetch error:", error);
        return null;
    }
};

function pickPlayers() {
  usernameInput.style.visibility = "visible";
  doneBtn.style.visibility = "visible";
  playersEl
}

async function startGame() {
    startPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "none";
    promptPage.style.display = "block";
    activity = await getPrompt();
    promptEl.textContent = activity
  }

  function play() {
    startPage.style.display = "none";
    playPage.style.display = "block";
    endPage.style.display = "none";
    promptPage.style.display = "none";
    nextBtn.style.visibility = "hidden";
    verdictEl.textContent = ""

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