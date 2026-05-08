const startPage = document.getElementById("start-page");
const promptPage = document.getElementById("prompt-page");
const votePage = document.getElementById("vote-page");
const revealPage = document.getElementById("reveal-page");
const playPage = document.getElementById("play-page");
const endPage = document.getElementById("end-page");
const nextBtn = document.getElementById("next-btn");
const verdictEl = document.getElementById("verdict-el");
const pointsEl = document.getElementById("points-el");
const promptEl = document.getElementById("prompt-data");
const promptPlayEl = document.getElementById("prompt-data-play");
const votePromptData = document.getElementById("vote-prompt-data");
const revealPromptData = document.getElementById("reveal-prompt-data");
const user1 = document.getElementById("username1-input");
const user2 = document.getElementById("username2-input");
const user3 = document.getElementById("username3-input");
const user4 = document.getElementById("username4-input");
const user5 = document.getElementById("username5-input");
const playersEl = document.getElementById("players");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const backToMenuBtn = document.getElementById("backToMenu");
const dbStatsDiv = document.getElementById("dbStats");
const historyListDiv = document.getElementById("historyList");
const finalScoresList = document.getElementById("finalScoresList");
const playersButtonsContainer = document.getElementById("playersButtonsContainer");
const votersContainer = document.getElementById("votersContainer");
const claimingPlayer = document.getElementById("claiming-player");
const revealPlayer = document.getElementById("reveal-player");
const revealTruthBtn = document.getElementById("reveal-truth-btn");
const revealLieBtn = document.getElementById("reveal-lie-btn");
const scoreDisplayPrompt = document.getElementById("scoreDisplayPrompt");
const scoreDisplayVote = document.getElementById("scoreDisplayVote");
const scoreDisplayReveal = document.getElementById("scoreDisplayReveal");
const scoreDisplayPlay = document.getElementById("scoreDisplayPlay");

// Database keys
const HISTORY_KEY = 'gameHistory';

// Game variables
let currentPlayers = [];
let currentPlayerIndex = 0;
let currentActivity = "";
let truthStatus = null;
let playerVotes = []; // Array of {voterIndex, believed}
let waitingForVotes = false;
let gameActive = false;
let currentScores = [];
let roundCount = 0;
const MAX_ROUNDS = 10;

// Populate player count dropdown
for (let i = 2; i < 6; i++) {
    let option = document.createElement("option");
    option.text = i;
    option.value = i;
    playersEl.appendChild(option);
}

// Score display function
function updateScoresDisplay() {
    if (!currentPlayers.length) return;
    
    let scoreText = "SCORES: ";
    for (let i = 0; i < currentPlayers.length; i++) {
        scoreText += `${currentPlayers[i]}: ${currentScores[i]}`;
        if (i < currentPlayers.length - 1) scoreText += " | ";
    }
    
    if (scoreDisplayPrompt) scoreDisplayPrompt.textContent = scoreText;
    if (scoreDisplayVote) scoreDisplayVote.textContent = scoreText;
    if (scoreDisplayReveal) scoreDisplayReveal.textContent = scoreText;
    if (scoreDisplayPlay) scoreDisplayPlay.textContent = scoreText;
}

// History functions
function saveWinnerToHistory(winner, score) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    history.unshift({
        winner: winner,
        score: score,
        date: new Date().toLocaleString()
    });
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    displayHistory();
    updateStats();
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    
    if (history.length === 0) {
        historyListDiv.innerHTML = "<div class='history-item'>No games played yet. Start a game!</div>";
        return;
    }
    
    historyListDiv.innerHTML = history.map(game => `
        <div class="history-item">
            <strong>${game.date}</strong><br>
            Winner: ${game.winner}<br>
            Score: ${game.score} points
        </div>
    `).join("");
}

function updateStats() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    if (dbStatsDiv) {
        dbStatsDiv.innerHTML = `<div>Total Games: ${history.length}</div>`;
    }
}

// API call with fallbacks
const API_ENDPOINTS = [
    "https://www.boredapi.com/api/activity",
    "https://bored-api.appbrewery.com/random",
    "https://apis.scrimba.com/bored/api/activity"
];

const FALLBACK_ACTIVITIES = [
    "Learn a magic trick", "Cook a new recipe", "Do 10 jumping jacks",
    "Draw a portrait", "Write a haiku", "Call a family member",
    "Organize your bookshelf", "Do a random act of kindness"
];

async function getPrompt() {
    for (let i = 0; i < API_ENDPOINTS.length; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(API_ENDPOINTS[i], { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                let activity = data.activity || data.activity_name || data.text;
                if (activity && activity.length > 0) {
                    return activity;
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    }
    
    const randomIndex = Math.floor(Math.random() * FALLBACK_ACTIVITIES.length);
    return FALLBACK_ACTIVITIES[randomIndex];
}

function pickPlayers() {
    const count = parseInt(playersEl.value);
    const usernameInputs = [user1, user2, user3, user4, user5];
    const doneBtns = [document.getElementById("done-btn1"), document.getElementById("done-btn2"), 
                       document.getElementById("done-btn3"), document.getElementById("done-btn4"), 
                       document.getElementById("done-btn5")];
    
    for (let i = 0; i < usernameInputs.length; i++) {
        if (i < count) {
            usernameInputs[i].style.visibility = "visible";
            doneBtns[i].style.visibility = "visible";
        } else {
            usernameInputs[i].style.visibility = "hidden";
            doneBtns[i].style.visibility = "hidden";
        }
    }
}

function submitName() {
    const count = parseInt(playersEl.value);
    currentPlayers = [];
    currentScores = [];
    const usernameInputs = [user1, user2, user3, user4, user5];
    
    for (let i = 0; i < count; i++) {
        let name = usernameInputs[i].value.trim();
        if (name === "") {
            name = "Player " + (i + 1);
        }
        currentPlayers.push(name);
        currentScores.push(0);
    }
    
    if (currentPlayers.length < 2) {
        alert("Need at least 2 players!");
        return false;
    }
    
    gameActive = true;
    roundCount = 0;
    return true;
}

async function startGame() {
    const success = submitName();
    if (!success) return;
    
    startPage.style.display = "none";
    votePage.style.display = "none";
    revealPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "none";
    promptPage.style.display = "block";
    
    currentActivity = await getPrompt();
    promptEl.textContent = currentActivity;
    
    updateScoresDisplay();
    
    playersButtonsContainer.innerHTML = "";
    for (let i = 0; i < currentPlayers.length; i++) {
        const buttonCard = document.createElement("div");
        buttonCard.className = "player-button-card";
        buttonCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">${currentPlayers[i]}</div>
            <div>Score: ${currentScores[i]}</div>
            <button class="claim-btn" data-index="${i}">I DID IT</button>
        `;
        playersButtonsContainer.appendChild(buttonCard);
    }
    
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            currentPlayerIndex = index;
            startVotingPhase();
        });
    });
}

function startVotingPhase() {
    promptPage.style.display = "none";
    votePage.style.display = "block";
    votePromptData.textContent = currentActivity;
    claimingPlayer.textContent = `${currentPlayers[currentPlayerIndex]} says: I did this activity. Do you believe them?`;
    
    waitingForVotes = true;
    playerVotes = [];
    
    // Create voting cards for each other player
    votersContainer.innerHTML = "";
    for (let i = 0; i < currentPlayers.length; i++) {
        if (i === currentPlayerIndex) continue; // Skip the claiming player
        
        const voterCard = document.createElement("div");
        voterCard.className = "voter-card";
        voterCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">${currentPlayers[i]}</div>
            <div class="horizontal">
                <button class="believe-btn" data-voter="${i}" data-believe="true">BELIEVE</button>
                <button class="disbelieve-btn" data-voter="${i}" data-believe="false">DOUBT</button>
            </div>
            <div class="voted-status" id="votedStatus_${i}"></div>
        `;
        votersContainer.appendChild(voterCard);
    }
    
    // Add event listeners to vote buttons
    document.querySelectorAll('.believe-btn, .disbelieve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!waitingForVotes) return;
            const voterIndex = parseInt(btn.getAttribute('data-voter'));
            const believe = btn.getAttribute('data-believe') === 'true';
            
            // Check if this voter already voted
            if (playerVotes.some(v => v.voterIndex === voterIndex)) return;
            
            playerVotes.push({ voterIndex, believe });
            
            // Mark as voted
            const statusSpan = document.getElementById(`votedStatus_${voterIndex}`);
            if (statusSpan) {
                statusSpan.textContent = "✓ VOTED";
                statusSpan.style.color = "green";
            }
            
            // Disable buttons for this voter
            const card = btn.closest('.voter-card');
            if (card) {
                card.querySelectorAll('button').forEach(b => b.disabled = true);
            }
            
            // Check if all other players have voted
            const expectedVotes = currentPlayers.length - 1;
            if (playerVotes.length === expectedVotes) {
                waitingForVotes = false;
                startRevealPhase();
            }
        });
    });
    
    updateScoresDisplay();
}

function startRevealPhase() {
    votePage.style.display = "none";
    revealPage.style.display = "block";
    revealPromptData.textContent = currentActivity;
    revealPlayer.textContent = `${currentPlayers[currentPlayerIndex]}, please reveal the truth:`;
    updateScoresDisplay();
}

revealTruthBtn.onclick = () => {
    truthStatus = true;
    calculateResults();
};

revealLieBtn.onclick = () => {
    truthStatus = false;
    calculateResults();
};

function calculateResults() {
    // Calculate points based on votes and truth status
    let believersCount = 0;
    let correctGuessers = [];
    
    for (let vote of playerVotes) {
        if (vote.believe === true) {
            believersCount++;
        }
        
        // Check if voter guessed correctly
        const guessedCorrectly = (vote.believe === truthStatus);
        if (guessedCorrectly) {
            correctGuessers.push(vote.voterIndex);
        }
    }
    
    // The claiming player gets 1 point for each person who believed them
    const pointsForClaimer = believersCount;
    currentScores[currentPlayerIndex] += pointsForClaimer;
    
    // Each correct guesser gets 1 point
    for (let idx of correctGuessers) {
        currentScores[idx] += 1;
    }
    
    // Show results
    revealPage.style.display = "none";
    playPage.style.display = "block";
    promptPlayEl.textContent = currentActivity;
    
    const truthText = truthStatus ? "TRUTH" : "LIE";
    verdictEl.innerHTML = `<strong>${currentPlayers[currentPlayerIndex]} was telling ${truthText}!</strong><br>`;
    verdictEl.innerHTML += `${believersCount} player(s) believed, ${playerVotes.length - believersCount} doubted.<br>`;
    verdictEl.innerHTML += `${correctGuessers.length} player(s) guessed correctly and got 1 point each.`;
    
    pointsEl.innerHTML = `${currentPlayers[currentPlayerIndex]} got +${pointsForClaimer} points!`;
    
    updateScoresDisplay();
    
    roundCount++;
    
    if (roundCount >= MAX_ROUNDS) {
        nextBtn.textContent = "END GAME";
    } else {
        nextBtn.textContent = "NEXT ROUND";
    }
    
    nextBtn.style.visibility = "visible";
    currentPlayerIndex = (currentPlayerIndex + 1) % currentPlayers.length;
}

async function nextRound() {
    if (!gameActive) return;
    
    if (roundCount >= MAX_ROUNDS) {
        endGame();
        return;
    }
    
    playPage.style.display = "none";
    promptPage.style.display = "block";
    nextBtn.style.visibility = "hidden";
    
    currentActivity = await getPrompt();
    promptEl.textContent = currentActivity;
    
    updateScoresDisplay();
    
    playersButtonsContainer.innerHTML = "";
    for (let i = 0; i < currentPlayers.length; i++) {
        const buttonCard = document.createElement("div");
        buttonCard.className = "player-button-card";
        buttonCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">${currentPlayers[i]}</div>
            <div>Score: ${currentScores[i]}</div>
            <div style="font-size: 12px; margin: 5px;">Round: ${roundCount + 1}/${MAX_ROUNDS}</div>
            <button class="claim-btn" data-index="${i}">I DID IT</button>
        `;
        playersButtonsContainer.appendChild(buttonCard);
    }
    
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            currentPlayerIndex = index;
            startVotingPhase();
        });
    });
}

function endGame() {
    gameActive = false;
    const sorted = [...currentPlayers].map((name, idx) => ({ name, score: currentScores[idx] }));
    sorted.sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    
    saveWinnerToHistory(winner.name, winner.score);
    
    startPage.style.display = "none";
    promptPage.style.display = "none";
    votePage.style.display = "none";
    revealPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "block";
    
    finalScoresList.innerHTML = `<h2>GAME OVER AFTER ${MAX_ROUNDS} ROUNDS!</h2>
        <h3>WINNER: ${winner.name} with ${winner.score} points!</h3>
        <hr>
        ${sorted.map((p, idx) => `<div style="margin: 10px 0;">${idx+1}. ${p.name}: ${p.score} points</div>`).join('')}`;
}

function goMenu() {
    startPage.style.display = "block";
    promptPage.style.display = "none";
    votePage.style.display = "none";
    revealPage.style.display = "none";
    playPage.style.display = "none";
    endPage.style.display = "none";
    
    currentPlayers = [];
    currentScores = [];
    gameActive = false;
    waitingForVotes = false;
    roundCount = 0;
    
    const usernameInputs = [user1, user2, user3, user4, user5];
    for (let i = 0; i < usernameInputs.length; i++) {
        usernameInputs[i].style.visibility = "hidden";
        usernameInputs[i].value = "";
    }
    
    updateStats();
    displayHistory();
}

// Event listeners
submitBtn.onclick = pickPlayers;
const doneBtns = [document.getElementById("done-btn1"), document.getElementById("done-btn2"), 
                   document.getElementById("done-btn3"), document.getElementById("done-btn4"), 
                   document.getElementById("done-btn5")];
for (let i = 0; i < doneBtns.length; i++) {
    doneBtns[i].onclick = submitName;
}
startBtn.onclick = startGame;
nextBtn.onclick = nextRound;
backToMenuBtn.onclick = goMenu;

// Initialize
updateStats();
displayHistory();