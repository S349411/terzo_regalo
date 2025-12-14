const gift = document.getElementById("gift");
const bow = document.getElementById("bow");
const resetBtn = document.getElementById("reset");
const confettiBox = document.getElementById("confetti");

const after = document.getElementById("after");
const afterNames = document.getElementById("afterNames");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalX = document.getElementById("modalX");
const modalList = document.getElementById("modalList");

let opened = false;

// SOLO questi partecipanti
const people = ["Zen", "Luca", "Mattia", "Sofia", "Michele", "Clelia", "Barcio"];

/* Modal */
function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  modalList.innerHTML = "";
  people.forEach((p) => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = p;
    modalList.appendChild(pill);
  });
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modalX.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Confetti scuri/rossi (particelle) */
function makeConfetti(count = 90) {
  confettiBox.innerHTML = "";
  const colors = ["#9B1C1C", "#6E1414", "#E6E6E6", "#BDBDBD", "#1A1F33"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");

    const left = Math.random() * 100;
    const w = 5 + Math.random() * 7;
    const h = 7 + Math.random() * 10;
    const dur = 1100 + Math.random() * 900; // più “lento”

    piece.style.left = left + "%";
    piece.style.width = w + "px";
    piece.style.height = h + "px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--dur", dur + "ms");

    confettiBox.appendChild(piece);
  }
}

/* Sequenza apertura: lid sparisce -> particelle -> regalo sale -> mostra partecipanti */
function openGiftSequence() {
  if (opened) return;
  opened = true;

  gift.classList.add("opening");

  setTimeout(() => {
    gift.classList.add("confetti-on");
    makeConfetti(95);
  }, 150);

  setTimeout(() => {
    gift.classList.remove("confetti-on");
    gift.classList.add("revealed");

    after.classList.add("show");
    afterNames.textContent = people.join(" · ");

    // clic sul testo finale apre la lista completa (carino + “segreto”)
    afterNames.style.cursor = "pointer";
    afterNames.title = "Mostra partecipanti";
    afterNames.onclick = openModal;
  }, 1900);
}

/* Reset */
function resetGift() {
  opened = false;

  gift.classList.remove("opening", "confetti-on", "revealed");
  confettiBox.innerHTML = "";

  bow.style.transition = "";
  bow.style.transform = "";

  after.classList.remove("show");
  afterNames.textContent = "";
  afterNames.onclick = null;

  closeModal();
}

/* Click/tap sul pacco */
gift.addEventListener("click", openGiftSequence);
gift.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openGiftSequence();
});

resetBtn.addEventListener("click", resetGift);

/* Drag sul fiocco (mobile + desktop) */
let dragging = false;
let startY = 0;
let currentDy = 0;

function getClientY(e) {
  return e.touches ? e.touches[0].clientY : e.clientY;
}

function onDown(e) {
  if (opened) return;
  dragging = true;
  startY = getClientY(e);
  bow.style.transition = "none";
}

function onMove(e) {
  if (!dragging || opened) return;
  const y = getClientY(e);
  currentDy = Math.min(0, y - startY);
  bow.style.transform = `translateY(${currentDy}px)`;
}

function onUp() {
  if (!dragging || opened) return;
  dragging = false;

  const threshold = -40;
  bow.style.transition = "transform 250ms ease";
  bow.style.transform = "translateY(0px)";

  if (currentDy <= threshold) openGiftSequence();
  currentDy = 0;
}

bow.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);

bow.addEventListener("touchstart", onDown, { passive: true });
window.addEventListener("touchmove", onMove, { passive: true });
window.addEventListener("touchend", onUp);
