let collections = [];
let items = [];

const url = "http://localhost:8080";

const cardsContainer = document.querySelector(".cards-container");
const heroContainer = document.querySelector(".hero");
const selectedCollectionElement = document.querySelector(
  ".selected-collection"
);
const loadingSpinner = document.getElementById("loading");

async function fetchCollections() {
  try {
    let response = await fetch(url + "/collections");
    let data = await response.json();
    collections = data;
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

async function fetchItems() {
  try {
    let response = await fetch(url + "/items");
    let data = await response.json();
    items = data;
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

const renderCard = () => {
  collections.map((collection) => {
    const cardElement = document.createElement("div");
    cardElement.innerHTML = `
    <div class="card p-3">
        <img src="./src/assets/images/Diplomatico.png" class="card-img-top" alt="..."/>
        <div class="card-body">
            <h5 class="card-title">${collection.name}</h5>
            <p class="card-text">${collection.theme}</p>
            <button id="${collection.name}" class="btn bg-mozaik text-white">Megnyitás</button>
        </div>
    </div>
    `;

    cardsContainer.appendChild(cardElement);
    const button = document.getElementById(collection.name);
    button.addEventListener("click", () => {
      openCollection(collection.name);
    });
  });
};

function addOrUpdateURLParam(key, value) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

function openCollection(collectionName) {
  //addOrUpdateURLParam("collection", collectionName);
  const selectedCollection = collections.find(
    (collection) => collection.name == collectionName
  );
  const selectedCollectionId = selectedCollection.collectionId;

  cardsContainer.style.display = "none";
  heroContainer.style.display = "none";

  items.map((item) => {
    if (item.collectionId == selectedCollectionId) {
      const collectionItem = document.createElement("div");
      collectionItem.innerHTML = `
    <div class="card itemCard p-3">
        <img src="./src/assets/images/Diplomatico.png" class="card-img-top" alt="..."/>
        <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <button id="updateBtn" class="btn btn-secondary">Szerkesztés</button>
            <button id="deleteBtn" class="btn btn-danger">Törlés</button>
        </div>
    </div>
    `;

      selectedCollectionElement.appendChild(collectionItem);

      const deleteBtn = document.getElementById("deleteBtn");
      const updateBtn = document.getElementById("updateBtn");

      deleteBtn.addEventListener("click", () => {
        // TODO: delete item from collectionData and update the view
      });
      updateBtn.addEventListener("click", () => {
        // TODO: open a form for updating the item's name
      });
    }
  });
  selectedCollectionElement.style.display = "grid";
}

const formatDate = (date) => {
  const isoString = date.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
};

export async function insertCollection() {
  //TODO: validate data
  const name = document.getElementById("name").value;
  const theme = document.getElementById("theme").value;
  const date = document.getElementById("date").value;

  await fetch(url + "/insertcollection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      theme: theme,
      date: date,
      collectionId: 8,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        new Alert("Gyűjtemény sikeresen létrehozva!");
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors here
    });
}

export function insertItem(itemElement) {
  //TODO: validate data
  const name = itemElement.name;
  const collectionId = itemElement.collectionId;

  fetch(url + "/insertitem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      collectionId: collectionId,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      //document.getElementById("result").innerHTML = JSON.stringify(result);
      // Display the API response in the "result" div
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors here
    });
}

fetchCollections();
fetchItems();

document
  .getElementById("newCollButton")
  .addEventListener("click", insertCollection);

setTimeout(() => {
  loadingSpinner.style.display = "none";
  renderCard();
}, 1000);
