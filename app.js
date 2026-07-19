(() => {
  "use strict";

  const WHATSAPP_DEFAULT = "31648203686";
  const HISTORY_LIMIT = 10;
  const MAX_QUANTITY = 20;
  const STORAGE = Object.freeze({
    settings: "zolderResort.settings.v1",
    history: "zolderResort.history.v1",
    dnd: "zolderResort.dnd.v1"
  });

  const MENU_DATA = Object.freeze([
    {
      id: "dinner",
      label: "Avondeten",
      icon: "🍽️",
      description: "Van chef's choice tot jullie eigen dinerwens.",
      items: [
        ["chefs-surprise", "Chef’s surprise", "Bram kiest iets feestelijks voor jullie.", "👨‍🍳"],
        ["dinner-wishes", "Dinerwensen laten opnemen", "De gastheer komt persoonlijk de wensen bespreken.", "📝"],
        ["pizza", "Pizza", "Een warme klassieker naar keuze.", "🍕"],
        ["pasta", "Pasta", "Comfort food voor een ontspannen avond.", "🍝"],
        ["toastie", "Tosti", "Krokant, warm en precies goed.", "🥪"],
        ["sandwiches", "Broodjes", "Belegd zoals jullie het lekker vinden.", "🥖"],
        ["fries-snacks", "Patat of snacks", "Goudgeel, hartig en feestelijk.", "🍟"],
        ["snack-board", "Snackplank", "Een gezellige mix om samen te delen.", "🧀"],
        ["small-bites", "Kleine hapjes", "Een selectie kleine hartige hapjes.", "🥨"],
        ["soup", "Soep", "Iets warms en rustigs.", "🥣"],
        ["vegetarian", "Iets vegetarisch", "Een smakelijke optie zonder vlees.", "🥗"],
        ["dinner-other", "Anders, beschrijf in notitie", "Vertel onderaan waar jullie zin in hebben.", "💭"]
      ]
    },
    {
      id: "snacks",
      label: "Snacks en zoet",
      icon: "🍿",
      description: "Voor trek, filmzin en een beetje verjaardagsmagie.",
      items: [
        ["popcorn", "Popcorn", "Zoet, zout of een verrassing.", "🍿"],
        ["crisps", "Chips", "Een knapperige snack naar keuze.", "🥔"],
        ["chocolate", "Chocolade", "Een klein luxe verwenmoment.", "🍫"],
        ["candy", "Snoep", "Een vrolijke mix om te delen.", "🍬"],
        ["cookies", "Koekjes", "Lekker bij thee, koffie of een film.", "🍪"],
        ["fruit", "Fruit", "Fris, kleurrijk en klaargemaakt.", "🍓"],
        ["ice-cream", "IJs", "Koud geluk in een schaaltje.", "🍨"],
        ["cake", "Taart of gebak", "Omdat een verjaardag taart verdient.", "🍰"],
        ["birthday-dessert", "Verjaardagsdessert", "Een feestelijk dessert speciaal voor jullie.", "🧁"],
        ["bram-surprise-snack", "Verrassing van Bram", "Vertrouw op de smaak van de gastheer.", "🎁"]
      ]
    },
    {
      id: "drinks",
      label: "Drinken",
      icon: "🥂",
      description: "Van fris en warm tot een koninklijk verrassingsdrankje.",
      items: [
        ["water-still", "Water plat", "Koel water zonder bubbels.", "💧"],
        ["water-sparkling", "Water bruisend", "Koel water met bubbels.", "🫧"],
        ["cola", "Cola", "Koud geserveerd.", "🥤"],
        ["cola-zero", "Cola zero", "Koud en zonder suiker.", "🥤"],
        ["fanta", "Fanta", "Fruitig en bruisend.", "🍊"],
        ["sprite", "Sprite of 7UP", "Fris met citroen-limoensmaak.", "🍋"],
        ["lemonade", "Limonade", "Een glas frisse limonade.", "🧃"],
        ["juice", "Sap", "Vertel eventueel in de notitie welke smaak.", "🧃"],
        ["tea", "Thee", "Warm en rustig; smaak naar keuze.", "🍵"],
        ["coffee", "Koffie", "Vers en warm geserveerd.", "☕"],
        ["hot-chocolate", "Warme chocolademelk", "Warm, zacht en gezellig.", "🍫"],
        ["mocktail", "Mocktail", "Feestelijk, kleurrijk en alcoholvrij.", "🍹"],
        ["surprise-drink", "Verrassingsdrankje", "Laat Bram iets passends bedenken.", "✨"],
        ["wine", "Wijntje", "Alleen voor de volwassen gast.", "🍷", { adultOnly: true }],
        ["adult-drink", "Ander volwassen drankje", "Alleen voor de volwassen gast; beschrijf de wens in de notitie.", "🥃", { adultOnly: true }]
      ]
    },
    {
      id: "comfort",
      label: "Comfort",
      icon: "🛏️",
      description: "Alles om jullie privéverblijf nóg comfortabeler te maken.",
      items: [
        ["extra-pillow", "Extra kussen", "Eén extra zacht kussen.", "🛏️"],
        ["extra-pillows", "Meerdere extra kussens", "Maak van het bed een echte bioscoopbank.", "☁️"],
        ["extra-blanket", "Extra deken", "Voor extra warmte en gezelligheid.", "🧶"],
        ["remake-bed", "Bed of bioscoopbank opnieuw opmaken", "Bram maakt alles weer comfortabel.", "🛋️"],
        ["adjust-lights", "Lampen aanpassen", "Lichter, zachter of precies goed.", "💡"],
        ["mood-lighting", "Kaarsjes of sfeerverlichting", "Warme sfeer zonder gedoe.", "🕯️"],
        ["ac-colder", "Airco kouder", "Een koelere zolder gewenst.", "❄️"],
        ["ac-warmer", "Airco warmer", "Iets warmer en behaaglijker.", "🔥"],
        ["check-temperature", "Temperatuur controleren", "Bram komt de temperatuur even checken.", "🌡️"],
        ["window", "Raam open of dicht", "Geef in de notitie aan wat jullie willen.", "🪟"],
        ["phone-charger", "Telefoonoplader", "Geef eventueel het type aansluiting door.", "🔌"],
        ["tissues", "Zakdoekjes", "Een nieuw pakje binnen handbereik.", "🤧"],
        ["towel", "Handdoek", "Een schone handdoek naar boven.", "🧺"],
        ["collect-dishes", "Afval of servies ophalen", "De gastheer ruimt het discreet op.", "🧹"]
      ]
    },
    {
      id: "entertainment",
      label: "Film en entertainment",
      icon: "🎬",
      description: "Bioscoopservice, muziek en gezelligheid op afroep.",
      items: [
        ["tv-help", "Hulp met televisie", "Technische roomservice voor het scherm.", "📺"],
        ["sound-help", "Hulp met geluid", "Zachter, harder of een ander apparaat.", "🔊"],
        ["find-film", "Film opzoeken", "Samen snel de juiste film vinden.", "🔎"],
        ["open-streaming", "Streamingsdienst openen", "Bram zet de juiste dienst klaar.", "▶️"],
        ["subtitles", "Ondertiteling instellen", "De juiste taal en weergave.", "💬"],
        ["volume", "Volume aanpassen", "Een comfortabel bioscoopvolume.", "🎚️"],
        ["cinema-lights", "Lichten in bioscoopstand", "Donker genoeg voor de film, sfeervol genoeg voor jullie.", "🌙"],
        ["popcorn-service", "Popcornservice", "Popcorn gebracht als in een echte bioscoop.", "🍿"],
        ["bram-film-choice", "Filmkeuze door Bram", "De gastheer kiest een passende film.", "🎞️"],
        ["music", "Muziek aanzetten", "Vertel eventueel welke sfeer jullie willen.", "🎵"],
        ["board-game", "Gezelschapsspel brengen", "Tijd voor een spelletje samen.", "🎲"],
        ["join-us", "Kom even gezellig naar boven", "Geen klusje, gewoon gezelligheid.", "🫶"]
      ]
    },
    {
      id: "service",
      label: "Hulp en service",
      icon: "🛎️",
      description: "De persoonlijke servicebalie van gastheer Bram.",
      items: [
        ["help-anything", "Kun je ergens mee helpen?", "Bram komt vragen wat er nodig is.", "🙋"],
        ["come-upstairs", "Kom even naar boven", "Even persoonlijk contact met de gastheer.", "⬆️"],
        ["sit-together", "Kom gezellig erbij zitten", "De officiële roomservicepauze.", "🫶"],
        ["pick-up", "Iets ophalen", "Beschrijf in de notitie wat en waar.", "📦"],
        ["find-something", "Iets zoeken", "Samen vinden we het sneller.", "🔍"],
        ["clean-up", "Opruimservice", "Een kleine lokale opruimronde.", "🧹"],
        ["take-dishes", "Servies meenemen", "Kopjes, borden en glazen worden opgehaald.", "🍽️"],
        ["check-door-window", "Deur of raam controleren", "Voor een gerust gevoel.", "🚪"],
        ["secret-request", "Geheim verzoek", "Bram handelt het graag discreet af.", "🤫"],
        ["service-other", "Anders, zie notitie", "Schrijf onderaan precies wat jullie nodig hebben.", "✍️"]
      ]
    },
    {
      id: "birthday",
      label: "Verjaardagsservice",
      icon: "🎂",
      description: "Kleine en grote extra's voor de Birthday Queen & Princess.",
      items: [
        ["birthday-song", "Verjaardagsliedje", "Live uitgevoerd door de gastheer.", "🎵"],
        ["mini-surprise", "Mini-surprise", "Een klein onverwacht feestmoment.", "🎉"],
        ["candle-dessert", "Dessert met kaarsje", "Maak een wens voordat het kaarsje uitgaat.", "🕯️"],
        ["photo-moment", "Foto-moment", "Bram helpt een mooie herinnering vastleggen.", "📸"],
        ["bring-present", "Cadeautje brengen", "Koninklijke bezorging aan de deur.", "🎁"],
        ["party-lights", "Feestverlichting", "De zolder gaat subtiel in feeststand.", "✨"],
        ["royal-announcement", "Koninklijke aankondiging", "Een entree zoals echte royalty verdient.", "📣"],
        ["champagne-mocktail", "Champagne-look mocktail", "Bubbels en uitstraling, zonder alcohol.", "🥂"],
        ["host-surprise", "Verrassing van de gastheer", "Volledig vertrouwen op Bram.", "🎊"],
        ["birthday-mission", "Geheime verjaardagsmissie", "Een discrete missie met feestelijke afloop.", "🕵️"]
      ]
    }
  ].map((category) => ({
    ...category,
    items: category.items.map(([id, name, description, icon, options = {}]) => ({ id, name, description, icon, ...options }))
  })));

  const PRIVACY_OPTIONS = Object.freeze([
    { id: "dnd-30", label: "30 minuten niet storen", detail: "De lokale timer start meteen.", duration: 30 },
    { id: "dnd-60", label: "60 minuten niet storen", detail: "Een rustig uur voor jullie samen.", duration: 60 },
    { id: "dnd-90", label: "90 minuten niet storen", detail: "Anderhalf uur volledige rust.", duration: 90 },
    { id: "dnd-until-call", label: "Niet storen totdat wij weer bellen", detail: "Blijft actief zonder afteltimer.", duration: null },
    { id: "knock-again", label: "Roomservice mag weer aankloppen", detail: "De niet-storenstatus wordt opgeheven.", duration: 0 }
  ]);

  const PRIORITIES = Object.freeze([
    { id: "relaxed", label: "Rustig aan", detail: "Wanneer het uitkomt", icon: "🌿", message: "Rustig aan — wanneer het uitkomt" },
    { id: "normal", label: "Normaal", detail: "Zodra je tijd hebt", icon: "🛎️", message: "Normaal — zodra je tijd hebt" },
    { id: "fast", label: "Zo snel mogelijk", detail: "We wachten erop", icon: "⚡", message: "Zo snel mogelijk — we wachten erop" },
    { id: "secret", label: "Geheime missie", detail: "Graag discreet", icon: "🤫", message: "Geheime missie — graag discreet" },
    { id: "emergency", label: "Noodbel", detail: "Kom direct even kijken", icon: "🚨", message: "Noodbel — kom direct even kijken" }
  ]);

  const SERVICE_STATUSES = Object.freeze([
    { id: "open", label: "Roomservice geopend", tone: "open", warning: "" },
    { id: "busy", label: "Gastheer is even bezig, maar bereikbaar", tone: "busy", warning: "Het kan iets langer duren, maar Bram ziet jullie verzoek zodra hij kan." },
    { id: "closed", label: "Roomservice tijdelijk gesloten", tone: "closed", warning: "Je kunt alvast bestellen. Houd rekening met een langere reactietijd." },
    { id: "kitchen-closed", label: "Keuken gesloten, overige service geopend", tone: "busy", warning: "Eten kan later komen; comfort, filmhulp en overige service blijven beschikbaar." },
    { id: "night", label: "Nachtservice actief", tone: "open", warning: "Nachtservice is open: Bram probeert extra zacht aan te kloppen." }
  ]);

  const ORDER_STATUSES = Object.freeze(["Ontvangen", "In bereiding", "Onderweg", "Afgeleverd", "Geannuleerd"]);
  const GUESTS = Object.freeze({
    najat: { label: "Najat", message: "Najat — Birthday Queen" },
    ameya: { label: "Ameya", message: "Ameya — Birthday Princess" },
    together: { label: "Najat & Ameya", message: "Najat & Ameya — Birthday Queen & Princess" }
  });

  const DEFAULT_SETTINGS = Object.freeze({
    host: "Bram",
    phone: WHATSAPP_DEFAULT,
    status: "open",
    sound: false,
    vibration: true,
    defaultPriority: "normal",
    pin: "2026"
  });

  const itemLookup = new Map();
  MENU_DATA.forEach((category) => category.items.forEach((item) => itemLookup.set(item.id, { ...item, categoryId: category.id })));

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let settings = readJSON(STORAGE.settings, DEFAULT_SETTINGS);
  let history = readJSON(STORAGE.history, []);
  let activeCategory = MENU_DATA[0].id;
  let pendingOrder = null;
  let dndState = readJSON(STORAGE.dnd, null);
  let dndInterval = null;
  let audioContext = null;

  settings = sanitizeSettings(settings);
  history = Array.isArray(history) ? history.slice(0, HISTORY_LIMIT) : [];
  dndState = sanitizeDnd(dndState);

  const draft = {
    guest: null,
    quantities: {},
    privacy: null,
    priority: settings.defaultPriority,
    note: "",
    orderNumber: createOrderNumber()
  };

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_error) {
      toast("Lokale opslag is niet beschikbaar op dit apparaat.");
      return false;
    }
  }

  function sanitizeSettings(value) {
    const source = value && typeof value === "object" ? value : {};
    const validStatus = SERVICE_STATUSES.some((status) => status.id === source.status);
    const validPriority = PRIORITIES.some((priority) => priority.id === source.defaultPriority);
    return {
      host: String(source.host || DEFAULT_SETTINGS.host).slice(0, 40),
      phone: /^\d{8,15}$/.test(String(source.phone || "")) ? String(source.phone) : DEFAULT_SETTINGS.phone,
      status: validStatus ? source.status : DEFAULT_SETTINGS.status,
      sound: Boolean(source.sound),
      vibration: source.vibration !== false,
      defaultPriority: validPriority ? source.defaultPriority : DEFAULT_SETTINGS.defaultPriority,
      pin: /^\d{4,8}$/.test(String(source.pin || "")) ? String(source.pin) : DEFAULT_SETTINGS.pin
    };
  }

  function sanitizeDnd(value) {
    if (!value || typeof value !== "object") return null;
    const option = PRIVACY_OPTIONS.find((entry) => entry.id === value.choiceId);
    if (!option || option.duration === 0) return null;
    const expiresAt = value.expiresAt === null ? null : Number(value.expiresAt);
    if (expiresAt !== null && (!Number.isFinite(expiresAt) || expiresAt <= Date.now())) return null;
    return { choiceId: option.id, expiresAt };
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createOrderNumber() {
    const random = globalThis.crypto?.getRandomValues
      ? globalThis.crypto.getRandomValues(new Uint16Array(1))[0].toString(36)
      : Math.floor(Math.random() * 65536).toString(36);
    return `ZR-${Date.now().toString(36).slice(-4).toUpperCase()}${random.slice(-2).toUpperCase()}`;
  }

  function formatDateTime(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("nl-NL", { dateStyle: "long", timeStyle: "short" }).format(date);
  }

  function formatShortDateTime(value) {
    return new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function totalRequests() {
    const items = Object.values(draft.quantities).reduce((sum, quantity) => sum + quantity, 0);
    return items + (draft.privacy ? 1 : 0);
  }

  function selectedItems() {
    return MENU_DATA.flatMap((category) => category.items)
      .filter((item) => (draft.quantities[item.id] || 0) > 0)
      .map((item) => ({ id: item.id, name: item.name, quantity: draft.quantities[item.id], icon: item.icon }));
  }

  function priorityById(id) {
    return PRIORITIES.find((priority) => priority.id === id) || PRIORITIES[1];
  }

  function privacyById(id) {
    return PRIVACY_OPTIONS.find((option) => option.id === id) || null;
  }

  function feedback(pattern = 10) {
    if (settings.vibration && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(pattern); } catch (_error) { /* optional feedback */ }
    }
    if (settings.sound) playClick();
  }

  function playClick() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audioContext ||= new AudioCtor();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .055);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + .06);
    } catch (_error) { /* audio is optional */ }
  }

  function toast(message) {
    const region = $("#toast-region");
    if (!region) return;
    const item = createElement("div", "toast", message);
    region.append(item);
    window.setTimeout(() => item.remove(), 3600);
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      dialog.setAttribute("aria-modal", "true");
    }
  }

  function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  function renderGuestSelection() {
    $$("[data-guest]").forEach((button) => {
      button.setAttribute("aria-checked", String(button.dataset.guest === draft.guest));
    });
  }

  function renderCategoryNav() {
    const nav = $("#category-nav");
    nav.replaceChildren();
    MENU_DATA.forEach((category) => {
      const button = createElement("button", "category-button");
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-current", String(category.id === activeCategory));
      button.append(document.createTextNode(`${category.icon} ${category.label}`));
      const count = category.items.reduce((sum, item) => sum + (draft.quantities[item.id] || 0), 0);
      if (count > 0) button.append(createElement("span", "category-button__count", String(count)));
      nav.append(button);
    });
  }

  function renderProducts(pulseId = null) {
    const category = MENU_DATA.find((entry) => entry.id === activeCategory) || MENU_DATA[0];
    $("#category-icon").textContent = category.icon;
    $("#category-title").textContent = category.label;
    $("#category-description").textContent = category.description;
    const grid = $("#product-grid");
    grid.replaceChildren();

    category.items.forEach((item) => {
      const quantity = draft.quantities[item.id] || 0;
      const blockedForGuest = item.adultOnly && draft.guest !== "najat" && draft.guest !== "together";
      const card = createElement("article", `product-card${quantity ? " product-card--selected" : ""}${blockedForGuest ? " product-card--disabled" : ""}${pulseId === item.id ? " product-card--pulse" : ""}`);
      card.dataset.itemId = item.id;
      card.append(createElement("span", "product-card__icon", item.icon));

      const copy = createElement("div", "product-card__copy");
      copy.append(createElement("strong", "", item.name), createElement("small", "", item.description));
      if (item.adultOnly) copy.append(createElement("span", "adult-label", "Alleen voor de volwassen gast"));
      card.append(copy);

      const actions = createElement("div", "product-card__actions");
      if (quantity === 0) {
        const add = createElement("button", "add-button", blockedForGuest ? "Kies Najat of Samen" : "Toevoegen");
        add.type = "button";
        add.dataset.action = "add";
        add.disabled = blockedForGuest;
        add.setAttribute("aria-label", `${item.name} toevoegen`);
        actions.append(add);
      } else {
        const selected = createElement("span", "adult-label", "Geselecteerd ✓");
        const control = createElement("div", "quantity-control");
        const minus = createElement("button", "quantity-button", "−");
        minus.type = "button";
        minus.dataset.action = "decrease";
        minus.setAttribute("aria-label", `Aantal ${item.name} verlagen`);
        const value = createElement("span", "quantity-value", String(quantity));
        value.setAttribute("aria-label", `Aantal ${item.name}: ${quantity}`);
        const plus = createElement("button", "quantity-button", "+");
        plus.type = "button";
        plus.dataset.action = "increase";
        plus.disabled = quantity >= MAX_QUANTITY;
        plus.setAttribute("aria-label", `Aantal ${item.name} verhogen`);
        control.append(minus, value, plus);
        actions.append(selected, control);
      }
      card.append(actions);
      grid.append(card);
    });
  }

  function renderPrivacy() {
    const container = $("#privacy-options");
    container.replaceChildren();
    PRIVACY_OPTIONS.forEach((option) => {
      const button = createElement("button", "choice-button");
      button.type = "button";
      button.dataset.privacy = option.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(draft.privacy === option.id));
      button.append(createElement("span", "choice-button__marker", "✓"));
      const copy = createElement("span");
      copy.append(createElement("strong", "", option.label), createElement("small", "", option.detail));
      button.append(copy);
      container.append(button);
    });
    updateDndTimer();
  }

  function renderPriorities() {
    const container = $("#priority-options");
    container.replaceChildren();
    PRIORITIES.forEach((priority) => {
      const button = createElement("button", "priority-button");
      button.type = "button";
      button.dataset.priority = priority.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(draft.priority === priority.id));
      button.append(createElement("span", "", priority.icon));
      const copy = createElement("span");
      copy.append(createElement("strong", "", priority.label), createElement("small", "", priority.detail));
      button.append(copy);
      container.append(button);
    });
  }

  function renderSummary() {
    const items = selectedItems();
    const requestCount = totalRequests();
    const priority = priorityById(draft.priority);
    const privacy = privacyById(draft.privacy);
    const note = draft.note.trim();
    const list = $("#summary-list");
    list.replaceChildren();
    items.forEach((item) => {
      const row = createElement("li");
      row.append(createElement("span", "", `${item.icon} ${item.name}`), createElement("strong", "", `${item.quantity}×`));
      list.append(row);
    });

    $("#summary-empty").hidden = requestCount > 0;
    $("#summary-guests").textContent = draft.guest ? GUESTS[draft.guest].label : "Nog niet gekozen";
    $("#summary-priority").textContent = priority.message;
    $("#summary-time").textContent = formatDateTime();
    $("#draft-order-number").textContent = draft.orderNumber;
    $("#summary-privacy-row").hidden = !privacy;
    $("#summary-privacy").textContent = privacy?.label || "";
    $("#summary-note-row").hidden = !note;
    $("#summary-note").textContent = note;
    $("#menu-count").textContent = `${requestCount} ${pluralize(requestCount, "gekozen", "gekozen")}`;
    $("#checkout-count").textContent = String(requestCount);
    $("#checkout-button").disabled = !draft.guest || requestCount === 0;
  }

  function renderServiceStatus() {
    const status = SERVICE_STATUSES.find((entry) => entry.id === settings.status) || SERVICE_STATUSES[0];
    const container = $("#service-status");
    container.className = `service-status service-status--${status.tone}`;
    $("#service-status-text").textContent = status.label;
    $("#service-warning").hidden = !status.warning;
    $("#service-warning").textContent = status.warning;
    $("#hero-host-name").textContent = settings.host;
    $("#checkout-button span:first-child").textContent = `Stuur naar gastheer ${settings.host}`;
  }

  function renderAll(pulseId = null) {
    renderGuestSelection();
    renderCategoryNav();
    renderProducts(pulseId);
    renderPrivacy();
    renderPriorities();
    renderSummary();
    renderServiceStatus();
  }

  function selectGuest(guestId) {
    if (!GUESTS[guestId]) return;
    draft.guest = guestId;
    if (guestId === "ameya") {
      let removed = 0;
      itemLookup.forEach((item, id) => {
        if (item.adultOnly && draft.quantities[id]) {
          delete draft.quantities[id];
          removed += 1;
        }
      });
      if (removed) toast("Volwassen drankjes zijn verwijderd: die zijn alleen voor Najat.");
    }
    feedback();
    renderAll();
  }

  function changeQuantity(itemId, delta) {
    const item = itemLookup.get(itemId);
    if (!item) return;
    if (item.adultOnly && draft.guest !== "najat" && draft.guest !== "together") {
      toast("Kies Najat of Samen voor een volwassen drankje.");
      return;
    }
    const previous = draft.quantities[itemId] || 0;
    const next = Math.max(0, Math.min(MAX_QUANTITY, previous + delta));
    if (next === 0) delete draft.quantities[itemId];
    else draft.quantities[itemId] = next;
    feedback(next > previous ? 12 : 7);
    renderCategoryNav();
    renderProducts(next > previous ? itemId : null);
    renderSummary();
    if (next > previous && previous === 0) toast(`${item.name} toegevoegd.`);
  }

  function selectPrivacy(optionId) {
    const option = privacyById(optionId);
    if (!option) return;
    if (draft.privacy === optionId) {
      draft.privacy = null;
      if (dndState?.choiceId === optionId) clearDnd();
      renderPrivacy();
      renderSummary();
      return;
    }

    draft.privacy = optionId;
    if (option.duration > 0) {
      dndState = { choiceId: option.id, expiresAt: Date.now() + option.duration * 60 * 1000 };
      writeJSON(STORAGE.dnd, dndState);
    } else if (option.duration === null) {
      dndState = { choiceId: option.id, expiresAt: null };
      writeJSON(STORAGE.dnd, dndState);
    } else {
      clearDnd(false);
    }
    feedback([10, 20, 10]);
    renderPrivacy();
    renderSummary();
  }

  function clearDnd(showMessage = false) {
    dndState = null;
    try { localStorage.removeItem(STORAGE.dnd); } catch (_error) { /* storage is optional */ }
    if (dndInterval) window.clearInterval(dndInterval);
    dndInterval = null;
    if (showMessage) toast("De niet-storenperiode is afgelopen.");
  }

  function updateDndTimer() {
    const container = $("#dnd-timer");
    if (!dndState) {
      container.hidden = true;
      if (dndInterval) window.clearInterval(dndInterval);
      dndInterval = null;
      return;
    }

    const option = privacyById(dndState.choiceId);
    if (!option) {
      clearDnd();
      container.hidden = true;
      return;
    }

    container.hidden = false;
    if (dndState.expiresAt === null) {
      $("#dnd-countdown").textContent = "Tot jullie weer bellen";
      $("#dnd-until").textContent = "Geen eindtijd ingesteld";
      return;
    }

    const remaining = dndState.expiresAt - Date.now();
    if (remaining <= 0) {
      if (draft.privacy === dndState.choiceId) draft.privacy = null;
      clearDnd(true);
      container.hidden = true;
      renderPrivacy();
      renderSummary();
      return;
    }

    const totalSeconds = Math.ceil(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    $("#dnd-countdown").textContent = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
    $("#dnd-until").textContent = `Tot ${new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(new Date(dndState.expiresAt))}`;
    if (!dndInterval) dndInterval = window.setInterval(updateDndTimer, 1000);
  }

  function createOrderSnapshot() {
    const createdAt = new Date().toISOString();
    return {
      id: draft.orderNumber,
      createdAt,
      guest: draft.guest,
      guestLabel: GUESTS[draft.guest]?.label || "Onbekend",
      items: selectedItems().map(({ id, name, quantity }) => ({ id, name, quantity })),
      privacy: draft.privacy,
      privacyLabel: privacyById(draft.privacy)?.label || "",
      priority: draft.priority,
      priorityLabel: priorityById(draft.priority).message,
      note: draft.note.trim(),
      status: "Ontvangen"
    };
  }

  function buildOrderMessage(order) {
    const lines = [];
    if (order.priority === "emergency") lines.push("🚨 GRAAG DIRECT EVEN NAAR BOVEN", "");
    lines.push(
      "🛎️ *ZOLDER RESORT — NIEUWE ROOMSERVICEBESTELLING*",
      `Bestelnummer: ${order.id}`,
      `Datum/tijd: ${formatDateTime(order.createdAt)}`,
      `Gast(en): ${GUESTS[order.guest]?.message || order.guestLabel}`,
      `Tempo: ${order.priorityLabel}`,
      "",
      "*Bestelling:*"
    );
    order.items.forEach((item) => lines.push(`• ${item.quantity}× ${item.name}`));
    if (order.privacyLabel) lines.push(`• Privacy: ${order.privacyLabel}`);
    if (order.note) lines.push("", "*Bijzonderheden:*", order.note);
    lines.push("", "Met liefde besteld door de Birthday Queen & Princess 👑✨");
    return lines.join("\n");
  }

  function openConfirmation() {
    if (!draft.guest) {
      toast("Kies eerst of Najat, Ameya of jullie samen bestellen.");
      $("#guest-heading").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (totalRequests() === 0) {
      toast("Kies eerst minstens één verzoek.");
      $("#menu-heading").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    pendingOrder = createOrderSnapshot();
    $("#message-preview").textContent = buildOrderMessage(pendingOrder);
    openDialog("confirm-dialog");
  }

  function saveOrder(order) {
    if (history.some((entry) => entry.id === order.id)) return;
    history.unshift(order);
    history = history.slice(0, HISTORY_LIMIT);
    writeJSON(STORAGE.history, history);
  }

  function finalizeOrder(order, message) {
    saveOrder(order);
    celebrate();
    toast(message);
    closeDialog("confirm-dialog");
    resetDraft({ preserveDnd: true, quiet: true });
  }

  async function openWhatsApp() {
    if (!pendingOrder) return;
    const order = pendingOrder;
    const message = buildOrderMessage(order);
    const url = `https://wa.me/${settings.phone}?text=${encodeURIComponent(message)}`;
    let opened = null;
    try {
      opened = window.open(url, "_blank");
    } catch (_error) {
      opened = null;
    }

    if (opened) {
      try { opened.opener = null; } catch (_error) { /* cross-origin window proxy */ }
    }

    if (opened) {
      finalizeOrder(order, "Bestelling klaargezet in WhatsApp. Tik daar nog op Versturen.");
      return;
    }

    saveOrder(order);
    const shared = await shareText(message, true);
    if (shared) {
      finalizeOrder(order, "WhatsApp opende niet; het bestelbericht is gedeeld.");
      return;
    }
    const copied = await copyText(message);
    if (copied) finalizeOrder(order, "WhatsApp opende niet; het bestelbericht is gekopieerd.");
    else toast("WhatsApp kon niet worden geopend. Selecteer en kopieer het bericht hierboven handmatig.");
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_error) { /* use legacy fallback */ }

    try {
      const textarea = createElement("textarea", "sr-only");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      document.body.append(textarea);
      textarea.select();
      const copied = typeof document.execCommand === "function" && document.execCommand("copy");
      textarea.remove();
      return copied;
    } catch (_error) {
      return false;
    }
  }

  async function shareText(text, silent = false) {
    if (typeof navigator.share !== "function") {
      if (!silent) toast("Delen wordt niet ondersteund; gebruik Kopieer.");
      return false;
    }
    try {
      await navigator.share({ title: "Zolder Resort Roomservice", text });
      return true;
    } catch (error) {
      if (!silent && error?.name !== "AbortError") toast("Delen lukte niet; gebruik Kopieer.");
      return false;
    }
  }

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = $("#confetti");
    const colors = ["#f0b7c7", "#f6d99a", "#bfe5c8", "#fffaf4"];
    for (let index = 0; index < 28; index += 1) {
      const piece = createElement("span", "confetti-piece");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty("--drift", `${(Math.random() - .5) * 180}px`);
      piece.style.setProperty("--spin", `${Math.random() * 720 - 360}deg`);
      piece.style.animationDelay = `${Math.random() * .25}s`;
      container.append(piece);
      window.setTimeout(() => piece.remove(), 2400);
    }
  }

  function resetDraft({ preserveDnd = true, quiet = false } = {}) {
    draft.guest = null;
    draft.quantities = {};
    draft.privacy = null;
    draft.priority = settings.defaultPriority;
    draft.note = "";
    draft.orderNumber = createOrderNumber();
    pendingOrder = null;
    $("#order-note").value = "";
    $("#note-counter").textContent = "0/500";
    if (!preserveDnd) clearDnd();
    renderAll();
    if (!quiet) toast("De huidige bestelling is gewist.");
  }

  function renderHistory() {
    const container = $("#history-list");
    container.replaceChildren();
    if (!history.length) {
      container.append(createElement("div", "empty-panel", "Nog geen bestellingen op dit apparaat."));
      return;
    }
    history.forEach((order) => {
      const card = createElement("article", "history-card");
      const header = createElement("div", "history-card__header");
      header.append(createElement("h3", "", order.id), createElement("time", "", formatShortDateTime(order.createdAt)));
      const itemSummary = order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ");
      card.append(header, createElement("p", "", `${order.guestLabel} · ${itemSummary || order.privacyLabel || "Serviceverzoek"}`));
      const status = createElement("p", "", `Lokale status: ${order.status || "Ontvangen"}`);
      card.append(status);
      const actions = createElement("div", "card-actions");
      const reorder = createElement("button", "", "Opnieuw bestellen");
      reorder.type = "button";
      reorder.dataset.historyAction = "reorder";
      reorder.dataset.orderId = order.id;
      const remove = createElement("button", "delete-button", "Verwijderen");
      remove.type = "button";
      remove.dataset.historyAction = "delete";
      remove.dataset.orderId = order.id;
      actions.append(reorder, remove);
      card.append(actions);
      container.append(card);
    });
  }

  function reorder(orderId) {
    const order = history.find((entry) => entry.id === orderId);
    if (!order) return;
    draft.guest = GUESTS[order.guest] ? order.guest : null;
    draft.quantities = {};
    order.items.forEach((item) => {
      if (itemLookup.has(item.id)) draft.quantities[item.id] = Math.max(1, Math.min(MAX_QUANTITY, Number(item.quantity) || 1));
    });
    draft.priority = PRIORITIES.some((entry) => entry.id === order.priority) ? order.priority : settings.defaultPriority;
    draft.note = String(order.note || "").slice(0, 500);
    draft.privacy = privacyById(order.privacy) ? order.privacy : null;
    draft.orderNumber = createOrderNumber();
    $("#order-note").value = draft.note;
    $("#note-counter").textContent = `${draft.note.length}/500`;
    if (draft.privacy) {
      const option = privacyById(draft.privacy);
      if (option.duration > 0) {
        dndState = { choiceId: option.id, expiresAt: Date.now() + option.duration * 60 * 1000 };
        writeJSON(STORAGE.dnd, dndState);
      } else if (option.duration === null) {
        dndState = { choiceId: option.id, expiresAt: null };
        writeJSON(STORAGE.dnd, dndState);
      } else clearDnd();
    }
    closeDialog("history-dialog");
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast(`${order.id} is als nieuwe bestelling geladen.`);
  }

  function removeHistoryOrder(orderId) {
    history = history.filter((entry) => entry.id !== orderId);
    writeJSON(STORAGE.history, history);
    renderHistory();
    renderDashboard();
    toast("Bestelling lokaal verwijderd.");
  }

  function fillSettingsForm() {
    $("#setting-host").value = settings.host;
    $("#setting-phone").value = settings.phone;
    $("#setting-status").value = settings.status;
    $("#setting-priority").value = settings.defaultPriority;
    $("#setting-sound").checked = settings.sound;
    $("#setting-vibration").checked = settings.vibration;
    $("#setting-pin").value = settings.pin;
  }

  function saveSettings(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const next = sanitizeSettings({
      host: $("#setting-host").value.trim(),
      phone: $("#setting-phone").value.trim(),
      status: $("#setting-status").value,
      defaultPriority: $("#setting-priority").value,
      sound: $("#setting-sound").checked,
      vibration: $("#setting-vibration").checked,
      pin: $("#setting-pin").value.trim()
    });
    const previousDefault = settings.defaultPriority;
    settings = next;
    writeJSON(STORAGE.settings, settings);
    if (draft.priority === previousDefault) draft.priority = settings.defaultPriority;
    renderServiceStatus();
    renderPriorities();
    renderSummary();
    closeDialog("settings-dialog");
    feedback();
    toast("Instellingen opgeslagen.");
  }

  function renderDashboard() {
    const filter = $("#dashboard-filter").value || "all";
    const orders = filter === "all" ? history : history.filter((order) => (order.status || "Ontvangen") === filter);
    const container = $("#dashboard-list");
    container.replaceChildren();
    if (!orders.length) {
      container.append(createElement("div", "empty-panel", "Geen lokale bestellingen voor dit filter."));
      return;
    }
    orders.forEach((order) => {
      const card = createElement("article", "dashboard-card");
      const header = createElement("div", "dashboard-card__header");
      header.append(createElement("h3", "", `${order.id} · ${order.guestLabel}`), createElement("time", "", formatShortDateTime(order.createdAt)));
      card.append(header);
      const details = order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ");
      card.append(createElement("p", "", details || order.privacyLabel || "Serviceverzoek"));
      if (order.note) card.append(createElement("p", "", `Notitie: ${order.note}`));
      const actions = createElement("div", "card-actions");
      const statusSelect = createElement("select", "dashboard-status");
      statusSelect.dataset.dashboardAction = "status";
      statusSelect.dataset.orderId = order.id;
      statusSelect.setAttribute("aria-label", `Status van ${order.id}`);
      ORDER_STATUSES.forEach((status) => {
        const option = createElement("option", "", status);
        option.value = status;
        option.selected = status === (order.status || "Ontvangen");
        statusSelect.append(option);
      });
      const remove = createElement("button", "delete-button", "Verwijderen");
      remove.type = "button";
      remove.dataset.dashboardAction = "delete";
      remove.dataset.orderId = order.id;
      actions.append(statusSelect, remove);
      card.append(actions);
      container.append(card);
    });
  }

  function changeOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) return;
    const order = history.find((entry) => entry.id === orderId);
    if (!order) return;
    order.status = status;
    writeJSON(STORAGE.history, history);
    renderDashboard();
    toast(`${orderId} staat nu op ${status}.`);
  }

  function populateSelects() {
    const statusSelect = $("#setting-status");
    SERVICE_STATUSES.forEach((status) => {
      const option = createElement("option", "", status.label);
      option.value = status.id;
      statusSelect.append(option);
    });
    const prioritySelect = $("#setting-priority");
    PRIORITIES.forEach((priority) => {
      const option = createElement("option", "", priority.message);
      option.value = priority.id;
      prioritySelect.append(option);
    });
    const dashboardFilter = $("#dashboard-filter");
    const allOption = createElement("option", "", "Alle statussen");
    allOption.value = "all";
    dashboardFilter.append(allOption);
    ORDER_STATUSES.forEach((status) => {
      const option = createElement("option", "", status);
      option.value = status;
      dashboardFilter.append(option);
    });
  }

  function bindEvents() {
    $("#guest-options").addEventListener("click", (event) => {
      const button = event.target.closest("[data-guest]");
      if (button) selectGuest(button.dataset.guest);
    });

    $("#category-nav").addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      feedback(6);
      renderCategoryNav();
      renderProducts();
      $("#category-title").focus?.({ preventScroll: true });
    });

    $("#product-grid").addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      const card = event.target.closest("[data-item-id]");
      if (!action || !card) return;
      const delta = action.dataset.action === "decrease" ? -1 : 1;
      changeQuantity(card.dataset.itemId, delta);
    });

    $("#privacy-options").addEventListener("click", (event) => {
      const button = event.target.closest("[data-privacy]");
      if (button) selectPrivacy(button.dataset.privacy);
    });

    $("#priority-options").addEventListener("click", (event) => {
      const button = event.target.closest("[data-priority]");
      if (!button) return;
      draft.priority = button.dataset.priority;
      feedback(8);
      renderPriorities();
      renderSummary();
    });

    $("#order-note").addEventListener("input", (event) => {
      draft.note = event.currentTarget.value.slice(0, 500);
      $("#note-counter").textContent = `${draft.note.length}/500`;
      renderSummary();
    });

    $("#checkout-button").addEventListener("click", openConfirmation);
    $("#reset-order-button").addEventListener("click", () => {
      if (totalRequests() === 0 && !draft.guest && !draft.note) return toast("De bestelling is al leeg.");
      if (window.confirm("Weet je zeker dat je de huidige bestelling wilt wissen?")) resetDraft({ preserveDnd: false });
    });
    $("#whatsapp-button").addEventListener("click", openWhatsApp);
    $("#copy-order-button").addEventListener("click", async () => {
      if (!pendingOrder) return;
      const copied = await copyText(buildOrderMessage(pendingOrder));
      toast(copied ? "Bestelbericht gekopieerd." : "Kopiëren lukte niet; selecteer de tekst handmatig.");
    });
    $("#share-order-button").addEventListener("click", async () => {
      if (!pendingOrder) return;
      await shareText(buildOrderMessage(pendingOrder));
    });

    $("#history-button").addEventListener("click", () => { renderHistory(); openDialog("history-dialog"); });
    $("#history-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-history-action]");
      if (!button) return;
      if (button.dataset.historyAction === "reorder") reorder(button.dataset.orderId);
      else if (window.confirm(`Bestelling ${button.dataset.orderId} lokaal verwijderen?`)) removeHistoryOrder(button.dataset.orderId);
    });
    $("#clear-history-button").addEventListener("click", () => {
      if (!history.length) return toast("Er is geen lokale geschiedenis om te wissen.");
      if (window.confirm("Alle lokale bestelgeschiedenis wissen? Dit kan niet ongedaan worden gemaakt.")) {
        history = [];
        writeJSON(STORAGE.history, history);
        renderHistory();
        renderDashboard();
        toast("Alle lokale bestelgeschiedenis is gewist.");
      }
    });

    $("#settings-button").addEventListener("click", () => { fillSettingsForm(); openDialog("settings-dialog"); });
    $("#settings-form").addEventListener("submit", saveSettings);
    $("#settings-clear-history-button").addEventListener("click", () => {
      if (!history.length) return toast("Er is geen lokale bestelgeschiedenis om te wissen.");
      if (window.confirm("Alle lokale bestellingen en dashboardstatussen wissen?")) {
        history = [];
        writeJSON(STORAGE.history, history);
        renderHistory();
        renderDashboard();
        toast("De lokale bestelgeschiedenis is gewist.");
      }
    });
    $("#app-reset-button").addEventListener("click", () => {
      if (!window.confirm("De hele app resetten, inclusief instellingen, timer en geschiedenis?")) return;
      Object.values(STORAGE).forEach((key) => {
        try { localStorage.removeItem(key); } catch (_error) { /* optional storage */ }
      });
      settings = { ...DEFAULT_SETTINGS };
      history = [];
      clearDnd();
      resetDraft({ preserveDnd: false, quiet: true });
      closeDialog("settings-dialog");
      toast("De app is volledig teruggezet naar de standaardinstellingen.");
    });

    $("#host-button").addEventListener("click", () => {
      $("#host-pin-input").value = "";
      $("#pin-error").hidden = true;
      openDialog("host-login-dialog");
      window.setTimeout(() => $("#host-pin-input").focus(), 100);
    });
    $("#host-login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if ($("#host-pin-input").value !== settings.pin) {
        $("#pin-error").hidden = false;
        feedback([25, 30, 25]);
        return;
      }
      closeDialog("host-login-dialog");
      renderDashboard();
      openDialog("host-dialog");
    });
    $("#dashboard-filter").addEventListener("change", renderDashboard);
    $("#dashboard-list").addEventListener("change", (event) => {
      const select = event.target.closest('[data-dashboard-action="status"]');
      if (select) changeOrderStatus(select.dataset.orderId, select.value);
    });
    $("#dashboard-list").addEventListener("click", (event) => {
      const button = event.target.closest('[data-dashboard-action="delete"]');
      if (button && window.confirm(`Bestelling ${button.dataset.orderId} uit het dashboard verwijderen?`)) removeHistoryOrder(button.dataset.orderId);
    });
    $("#dashboard-reset-button").addEventListener("click", () => {
      if (!history.length) return toast("Het dashboard is al leeg.");
      if (window.confirm("Alle lokale dashboardbestellingen verwijderen?")) {
        history = [];
        writeJSON(STORAGE.history, history);
        renderDashboard();
        toast("Dashboard gereset.");
      }
    });

    $$('[data-close-dialog]').forEach((button) => {
      button.addEventListener("click", () => closeDialog(button.dataset.closeDialog));
    });
    $$("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog.id);
      });
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // The app remains fully usable without a service worker.
      });
    });
  }

  function initialize() {
    populateSelects();
    bindEvents();
    renderAll();
    fillSettingsForm();
    updateDndTimer();
    window.setInterval(() => { if (!document.hidden) renderSummary(); }, 60000);
    registerServiceWorker();
  }

  initialize();
})();
