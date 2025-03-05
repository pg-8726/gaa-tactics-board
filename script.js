let players = JSON.parse(localStorage.getItem('gaaPlayers')) || [];

function savePlayers() {
    localStorage.setItem('gaaPlayers', JSON.stringify(players));
}

function renderPlayers() {
    const playerList = document.getElementById("players");
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

document.getElementById("add-player-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("player-name").value.trim();
    const position = document.getElementById("player-position").value;
    if (players.some(p => p.position === position)) {
        alert("This position is already filled!");
        return;
    }
    const newPlayer = { name, position };
    players.push(newPlayer);
    savePlayers();
    renderPlayers();
    document.getElementById("player-name").value = "";
    document.getElementById("player-position").selectedIndex = 0;
});

function attachDragEvents() {
    const draggables = document.querySelectorAll(".player");
    const dropZones = document.querySelectorAll(".drop-zone");

    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", draggable.dataset.name);
        });

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

renderPlayers();
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
