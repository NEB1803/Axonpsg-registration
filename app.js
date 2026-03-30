const API = "https://script.google.com/macros/s/AKfycbya0LRJSs2OVmoghIvAzuXc93qmda9CHe6f3TS4UQLi-2Cj2CSXsl9j-U6jSHYwROGPSg/exec";

/* PWA REGISTER */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

/* EXTRACT ID */
function extractId(text) {
  if (text.includes("wixevents")) {
    return text.split("/check-in/")[1].split(",")[0];
  }
  return text;
}

/* OFFLINE QUEUE */
function saveOffline(id) {
  let queue = JSON.parse(localStorage.getItem("queue") || "[]");
  queue.push(id);
  localStorage.setItem("queue", JSON.stringify(queue));
}

/* SYNC QUEUE */
async function syncQueue() {
  let queue = JSON.parse(localStorage.getItem("queue") || "[]");

  for (let id of queue) {
    await fetch(API + "?id=" + id);
  }

  localStorage.setItem("queue", "[]");
}

window.addEventListener("online", syncQueue);

/* FETCH */
async function fetchData(id) {
  try {
    let res = await fetch(API + "?id=" + id);
    let data = await res.json();
    showResult(data);
  } catch {
    saveOffline(id);
    alert("Offline saved");
  }
}

/* SCANNER */
function startScanner() {
  const qr = new Html5Qrcode("reader");

  qr.start({ facingMode: "environment" }, { fps: 10 }, (text) => {
    qr.stop();
    fetchData(extractId(text));
  });
}

/* SEARCH */
function manualSearch() {
  let val = document.getElementById("manualId").value;
  fetchData(extractId(val));
}

/* RESULT */
function showResult(res) {
  let div = document.getElementById("result");

  div.innerHTML = `<h3>${res.status}</h3>${res.name || ""}`;
}