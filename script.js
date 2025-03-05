// Load players from localStorage or initialize empty array
let players = [];
try {
    players = JSON.parse(localStorage.getItem('gaaPlayers')) || [];
} catch (e) {
    console.error("Error loading from localStorage:", e);
}

// Function to save players to localStorage
function savePlayers() {
    try {
        localStorage.setItem('gaaPlayers', JSON.stringify(players));
        console.log("Players saved:", players); // Debug log
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        alert("Failed to save players. Your browser may block localStorage.");
    }
}

// Function to render players in the list
function renderPlayers() {
    const playerList = document.getElementById("players");
    if (!playerList) {
        console.error("Player list element not found!");
        return;
    }
    playerList.innerHTML = "";
    players.forEach(player => {
        const div = document.createElement("div");
        div.className = "player";
        div.draggable = true;
        div.textContent = `${player.name} (${player.position})`;
        div.dataset.name = player.name;
        div.dataset.position = player.position;
        playerList.appendChild(div);
    });
    attachDragEvents();
}

// Handle form submission to add a player
const form = document.getElementById("add-player-form");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("player-name");
        const positionSelect = document.getElementById("player-position");
        if (!nameInput || !positionSelect) {
            console.error("Form inputs not found!");
            return;
        }
        const name = nameInput.value.trim();
        const position = positionSelect.value;

        if (!name || !position) {
            alert("Please enter a name and select a position!");
            return;
        }

        if (players.some(p => p.position === position)) {
            alert("This position is already filled!");
            return;
        }

        const newPlayer = { name, position };
        players.push(newPlayer);
        savePlayers();
        renderPlayers();

        nameInput.value = "";
        positionSelect.selectedIndex = 0;
    });
} else {
    console.error("Form element not found!");
}

// Drag-and-Drop Logic (Desktop + Mobile)
function attachDragEvents() {
    const draggables = document.querySelectorAll(".player");
    const dropZones = document.querySelectorAll(".drop-zone");

    draggables.forEach(draggable => {
        // Desktop drag events
        draggable.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", draggable.dataset.name);
        });

        // Mobile touch events
        let touchStartX, touchStartY;
        draggable.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            draggable.classList.add("dragging");
        });

        draggable.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            draggable.style.position = "absolute";
            draggable.style.left = `${touch.clientX - 30}px`;
            draggable.style.top = `${touch.clientY - 15}px`;
        });

        draggable.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0];
            const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
            draggable.style.position = "";
            draggable.style.left = "";
            draggable.style.top = "";
            draggable.classList.remove("dragging");
            if (dropZone && dropZone.classList.contains("drop-zone")) {
                const name = draggable.dataset.name;
                const player = players.find(p => p.name === name);
                if (dropZone.textContent === "" && dropZone.dataset.position === player.position) {
                    dropZone.textContent = name;
                }
            }
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("drag-over");
        });
        zone.addEventListener("dragleave", () => {
            zone.classList.remove("drag-over");
        });
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            const name = e.dataTransfer.getData("text/plain");
            const player = players.find(p => p.name === name);
            if (zone.textContent === "" && zone.dataset.position === player.position) {
                zone.textContent = name;
            }
            zone.classList.remove("drag-over");
        });
    });
}

// Initial render of players
renderPlayers();
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
​​​​​​​​​​​​​​​​​
