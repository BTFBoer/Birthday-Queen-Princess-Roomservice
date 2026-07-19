"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
assert.match(html, /\.\/styles\.css\?v=1\.0\.2/, "stylesheet heeft een cache-buster");
assert.match(html, /\.\/app\.js\?v=1\.0\.2/, "appscript heeft een cache-buster");
const dom = new JSDOM(html, {
  url: "https://btfboer.github.io/Birthday-Queen-Princess-Roomservice/",
  runScripts: "outside-only",
  pretendToBeVisual: true
});

const { window } = dom;
const { document } = window;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.HTMLElement.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};
window.confirm = () => true;
window.navigator.vibrate = () => true;
let openedUrl = "";
window.open = (url) => { openedUrl = url; return { opener: null }; };
document.execCommand = () => true;

window.eval(source);

const click = (selector, rootNode = document) => {
  const target = rootNode.querySelector(selector);
  assert.ok(target, `Element ontbreekt: ${selector}`);
  target.click();
  return target;
};

const input = (selector, value) => {
  const target = document.querySelector(selector);
  target.value = value;
  target.dispatchEvent(new window.Event("input", { bubbles: true }));
};

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 0));

(async () => {
  assert.equal(document.querySelectorAll("[data-guest]").length, 3, "drie gastkeuzes");
  assert.equal(document.querySelectorAll("[data-item-id]").length, 12, "avondetencategorie rendert");
  assert.equal(document.querySelector("#checkout-button").disabled, true, "zonder gast en verzoek geblokkeerd");

  const expectedMenus = {
    dinner: ["Chef’s surprise", "Dinerwensen laten opnemen", "Pizza", "Pasta", "Tosti", "Broodjes", "Patat of snacks", "Snackplank", "Kleine hapjes", "Soep", "Iets vegetarisch", "Anders, beschrijf in notitie"],
    snacks: ["Popcorn", "Chips", "Chocolade", "Snoep", "Koekjes", "Fruit", "IJs", "Taart of gebak", "Verjaardagsdessert", "Verrassing van Bram"],
    drinks: ["Water plat", "Water bruisend", "Cola", "Cola zero", "Fanta", "Sprite of 7UP", "Limonade", "Sap", "Thee", "Koffie", "Warme chocolademelk", "Mocktail", "Verrassingsdrankje", "Wijntje", "Ander volwassen drankje"],
    comfort: ["Extra kussen", "Meerdere extra kussens", "Extra deken", "Bed of bioscoopbank opnieuw opmaken", "Lampen aanpassen", "Kaarsjes of sfeerverlichting", "Airco kouder", "Airco warmer", "Temperatuur controleren", "Raam open of dicht", "Telefoonoplader", "Zakdoekjes", "Handdoek", "Afval of servies ophalen"],
    entertainment: ["Hulp met televisie", "Hulp met geluid", "Film opzoeken", "Streamingsdienst openen", "Ondertiteling instellen", "Volume aanpassen", "Lichten in bioscoopstand", "Popcornservice", "Filmkeuze door Bram", "Muziek aanzetten", "Gezelschapsspel brengen", "Kom even gezellig naar boven"],
    service: ["Kun je ergens mee helpen?", "Kom even naar boven", "Kom gezellig erbij zitten", "Iets ophalen", "Iets zoeken", "Opruimservice", "Servies meenemen", "Deur of raam controleren", "Geheim verzoek", "Anders, zie notitie"],
    birthday: ["Verjaardagsliedje", "Mini-surprise", "Dessert met kaarsje", "Foto-moment", "Cadeautje brengen", "Feestverlichting", "Koninklijke aankondiging", "Champagne-look mocktail", "Verrassing van de gastheer", "Geheime verjaardagsmissie"]
  };
  Object.entries(expectedMenus).forEach(([category, expected]) => {
    click(`[data-category="${category}"]`);
    const names = [...document.querySelectorAll("#product-grid .product-card__copy strong")].map((element) => element.textContent);
    assert.deepEqual(names, expected, `volledige categorie ${category}`);
  });
  click('[data-category="dinner"]');

  click('[data-item-id="chefs-surprise"] [data-action="add"]');
  assert.equal(document.querySelector("#checkout-button").disabled, true, "zonder gast blijft bestellen geblokkeerd");
  assert.equal(document.querySelector("#checkout-count").textContent, "1", "verzoekbadge telt mee");
  click('[data-guest="together"]');
  assert.equal(document.querySelector("#checkout-button").disabled, false, "met gast en verzoek kan worden besteld");
  click('[data-item-id="chefs-surprise"] [data-action="increase"]');
  assert.equal(document.querySelector('[data-item-id="chefs-surprise"] .quantity-value').textContent, "2", "aantal verhogen");
  click('[data-item-id="chefs-surprise"] [data-action="decrease"]');
  click('[data-item-id="chefs-surprise"] [data-action="decrease"]');
  assert.equal(document.querySelector('[data-item-id="chefs-surprise"] .quantity-value'), null, "nul verwijdert artikel");
  assert.equal(document.querySelector("#checkout-button").disabled, true, "zonder verzoek weer geblokkeerd");

  click('[data-category="drinks"]');
  click('[data-item-id="wine"] [data-action="add"]');
  assert.equal(document.querySelector('[data-item-id="wine"] .quantity-value').textContent, "1", "volwassen drankje voor Samen mogelijk");
  click('[data-guest="ameya"]');
  assert.equal(document.querySelector('[data-item-id="wine"] .quantity-value'), null, "volwassen drankje bij Ameya verwijderd");
  assert.equal(document.querySelector('[data-item-id="wine"] [data-action="add"]').disabled, true, "volwassen drankje bij Ameya geblokkeerd");

  click('[data-privacy="dnd-30"]');
  click('[data-privacy="dnd-60"]');
  assert.equal(document.querySelectorAll('#privacy-options [aria-checked="true"]').length, 1, "privacykeuze exclusief");
  assert.equal(document.querySelector('[data-privacy="dnd-60"]').getAttribute("aria-checked"), "true", "laatste privacykeuze actief");
  assert.equal(document.querySelector("#dnd-timer").hidden, false, "afteltimer zichtbaar");
  assert.ok(window.localStorage.getItem("zolderResort.dnd.v1"), "timer opgeslagen");

  input("#order-note", '<img src=x onerror="window.__unsafe=true"> graag zacht kloppen');
  assert.equal(document.querySelector("#summary-note img"), null, "gebruikersinvoer wordt niet als HTML ingevoegd");
  assert.match(document.querySelector("#summary-note").textContent, /<img/, "gebruikersinvoer blijft zichtbare tekst");
  click('[data-priority="emergency"]');
  click("#checkout-button");
  assert.equal(document.querySelector("#confirm-dialog").hasAttribute("open"), true, "bevestigingsdialoog opent");
  assert.match(document.querySelector("#message-preview").textContent, /^🚨 GRAAG DIRECT EVEN NAAR BOVEN/, "noodbel staat vooraan");
  click("#whatsapp-button");
  await wait();
  assert.match(openedUrl, /^https:\/\/wa\.me\/31648203686\?text=/, "correct WhatsApp-nummer");
  assert.match(decodeURIComponent(openedUrl.split("?text=")[1]), /Gast\(en\): Ameya — Birthday Princess/, "WhatsApp-tekst bevat gast");
  let saved = JSON.parse(window.localStorage.getItem("zolderResort.history.v1"));
  assert.equal(saved.length, 1, "bestelling lokaal opgeslagen");
  assert.equal(document.querySelector("#checkout-button").disabled, true, "nieuwe lege bestelling na afronden");

  click("#history-button");
  assert.equal(document.querySelectorAll(".history-card").length, 1, "geschiedenis rendert");
  click('[data-history-action="reorder"]');
  assert.equal(document.querySelector("#order-note").value.includes("graag zacht kloppen"), true, "opnieuw bestellen herstelt notitie");
  assert.equal(document.querySelector("#checkout-button").disabled, false, "opnieuw geladen bestelling is bestelbaar");

  click("#settings-button");
  document.querySelector("#setting-host").value = "Bram Test";
  document.querySelector("#setting-phone").value = "31611111111";
  document.querySelector("#setting-status").value = "closed";
  document.querySelector("#setting-pin").value = "1234";
  document.querySelector("#settings-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  assert.equal(document.querySelector("#hero-host-name").textContent, "Bram Test", "gastheerinstelling toegepast");
  assert.equal(document.querySelector("#service-status-text").textContent, "Roomservice tijdelijk gesloten", "servicestatus toegepast");
  assert.equal(document.querySelector("#service-warning").hidden, false, "geslotenwaarschuwing zichtbaar");

  click("#checkout-button");
  click("#whatsapp-button");
  await wait();
  assert.match(openedUrl, /^https:\/\/wa\.me\/31611111111\?text=/, "aangepast WhatsApp-nummer gebruikt");
  saved = JSON.parse(window.localStorage.getItem("zolderResort.history.v1"));
  assert.equal(saved.length, 2, "tweede unieke bestelling opgeslagen");

  click("#host-button");
  document.querySelector("#host-pin-input").value = "1234";
  document.querySelector("#host-login-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  assert.equal(document.querySelector("#host-dialog").hasAttribute("open"), true, "dashboard opent met lokale pincode");
  assert.equal(document.querySelectorAll(".dashboard-card").length, 2, "dashboard toont lokale bestellingen");
  const status = document.querySelector('[data-dashboard-action="status"]');
  status.value = "Afgeleverd";
  status.dispatchEvent(new window.Event("change", { bubbles: true }));
  saved = JSON.parse(window.localStorage.getItem("zolderResort.history.v1"));
  assert.equal(saved.find((order) => order.id === status.dataset.orderId).status, "Afgeleverd", "dashboardstatus opgeslagen");

  window.open = () => null;
  Object.defineProperty(window.navigator, "share", { value: undefined, configurable: true });
  Object.defineProperty(window.navigator, "clipboard", { value: undefined, configurable: true });
  click('[data-dashboard-action="delete"]');
  assert.equal(JSON.parse(window.localStorage.getItem("zolderResort.history.v1")).length, 1, "bestelling verwijderen werkt");

  dom.window.close();
  console.log("DOM-smoketest geslaagd: gast, menu, privacy, timer, escaping, WhatsApp, geschiedenis, instellingen en dashboard.");
})().catch((error) => {
  console.error(error);
  dom.window.close();
  process.exitCode = 1;
});
