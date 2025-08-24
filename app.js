// === PARAMETERS ===
/**
 * @typedef Party
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 */

// === CONSTANTS ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2506-ftb-ct-web-pt";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === STATE ===
let parties = [];
let selectedParty = null;

// === API FUNCTIONS ===

//** Updates state with all PARTIES from the API */
async function getParties() {
    try {
        const response = await fetch(API);
        const result = await response.json();
        parties = result.data;
        render ();
    } catch (e) {
        console.error("Error fetchign parties", e);
    }
}

//** Updates state with a single PARTY from the API */
async function getPartyId(id) {
    try {
        const response = await fetch(API + "/" + id);
        const result = await response.json();
        selectedParty = result.data;
        render();
    } catch (e) {
        console.error("Error fetching party", e);
    }
}

// === COMPONENTS ===

//** Party name that shows more details about the PARTY when clicked */
function PartyListItem(party) {
    const $li = document.createElement("li");
    const $link = document.createElement("a");
    $link.href = "#selected";
    $link.textContent = party.name;
    $link.addEventListener("click", ()=> getPartyId(party.id));
    $li.appendChild($link);
    return $li;
}

//** A list of names of all PARTIES */
function PartyList() {
    const $ul = document.createElement("ul");
    $ul.classList.add("party-list");

    if (parties.length === 0) {
        const $p = document.createElement ("p");
        $p.textContent = "No parties available";
        return $p;
    }

    const $items = parties.map(PartyListItem);
    $ul.replaceChildren(...$items);

    return $ul;
}

//** Detailed information abotu the selected PARTY */
function PartyDetails() {
    const $section = document.createElement("section");
    $section.classList.add("party-details");

    if (!selectedParty) {
        const $p = document.createElement("p");
        $p.textContent = "Please seelct a party to learn more";
        $section.appendChild($p);
        return $section;
    }

    $section.innerHTML = `
    <h3>${selectedParty.name} (#${selectedParty.id})</h3>
    <p><strong>Date:</strong> ${selectedParty.date}</p>
    <p><strong>Location:</strong> ${selectedParty.location}</p>
    <p>${selectedParty.description}</p>
    `;

    return $section;
}

// === RENDER ===
function render() {
    const $app = document.querySelector("#app");
    $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <div id="party-list"></div>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <div id="party-details"></div>
      </section>
    </main>
  `;

  $app.querySelector("#party-list").replaceWith(PartyList());
  $app.querySelector("#party-details").replaceWith(PartyDetails());  
}

async function init() {
    await getParties();
    render();
}

init();