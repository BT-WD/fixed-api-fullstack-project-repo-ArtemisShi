const url = "https://bored-api.appbrewery.com/random"
const startPage = document.getElementById("start-page");
const promptPage = document.getElementById("prompt-page");
const playPage = document.getElementById("play-page");
const endPage = document.getElementById("end-page");
const points = [];
const usernames = [];


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
  }

  function confirmStatement() {
    startPage.style.display = "none";
    playPage.style.display = "block";
    endPage.style.display = "none";
    promptPage.style.display = "none";
  }
    