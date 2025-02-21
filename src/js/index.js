let collections = [];
let items = [];

const url = "http://localhost:8080";
var selectedCollectionId = -1;
const cardsContainer = document.querySelector(".cards-container");
const heroContainer = document.querySelector(".hero");
const collectionHero = document.querySelector(".collectionHero");
const selectedCollectionElement = document.querySelector(
  ".selected-collection"
);
const loadingSpinner = document.getElementById("loading");
const collectionWindow = document.getElementById("newCollectionWindow");
const itemWindow = document.getElementById("newItemWindow");
const successCollectionAlert = document.getElementById(
  "success-collection-alert"
);
const successItemAlert = document.getElementById("success-item-alert");

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

export const renderCard = () => {
  collections.map((collection) => {
    const cardElement = document.createElement("div");
    cardElement.innerHTML = `
    <div class="card p-1 card-width">
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
    button?.addEventListener("click", () => {
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
  selectedCollectionId = selectedCollection.collectionId;

  cardsContainer.style.display = "none";
  heroContainer.style.display = "none";
  //collectionWindow.style.display = "none";

  items.map((item) => {
    if (item.collectionId == selectedCollectionId) {
      const collectionItem = document.createElement("div");
      const updatenameID = "nameBTN" + item.name;
      const deleteID = "deleteBTN" + item.name;
      const moveID = "moveBTN" + item.name;
      collectionItem.innerHTML = `
    <div class="card itemCard p-3">
        <img src="./src/assets/images/Diplomatico.png" class="card-img-top" alt="..."/>
        <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <div class="btn-group">
              <button
                type="button"
                class="btn bg-mozaik text-white dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >
                Lehetőségek
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a id="${updatenameID}" class="dropdown-item updateBtn"> Átnevezés </a>
                </li>
                <li>
                  <a id="${deleteID}" class="dropdown-item deleteBtn"> Törlés </a>
                </li>
                <li>
                  <a id="${moveID}" class="dropdown-item moveBtn"> Áthelyezés </a>
                </li>
              </ul>
            </div>
        </div>
    </div>
    `;

      selectedCollectionElement.appendChild(collectionItem);

      const deleteBtn = document.getElementById(deleteID);
      const updateBtn = document.getElementById(updatenameID);
      const moveBtn = document.getElementById(moveID);

      deleteBtn.addEventListener("click", () => {
        console.log("click");
        deleteItem(item.name);
      });
      updateBtn.addEventListener("click", () => {
        // TODO: open a form for updating the item's name
      });
      moveBtn.addEventListener("click", () => {
        // TODO: move
      });
    }
  });
  selectedCollectionElement.style.display = "grid";
  itemWindow.style.display = "grid";
  collectionHero.style.display = "block";
}

export async function insertCollection() {
  //TODO: validate data
  const name = document.getElementById("name").value;
  const theme = document.getElementById("theme").value;
  const date = document.getElementById("date").value;

  let collectionId = 0;
  collections.map((collection) => {
    if (collection.collectionId > collectionId) {
      collectionId = collection.collectionId;
    }
  });
  collectionId += 1;

  await fetch(url + "/insertcollection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      theme: theme,
      date: date,
      collectionId: collectionId,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        successCollectionAlert.style.display = "block";
        renderCard();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
export function insertItem() {
  //TODO: validate data
  const name = document.getElementById("itemName").value;
  const collectionId = selectedCollectionId;
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
    .then((response) => {
      if (response.status === 200) {
        successItemAlert.style.display = "block";
        renderCard();
      }
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors here
    });
}

export function deleteCollection(collectionName) {
  console.log("lefut");
  fetch(url + "/deletecollection", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: collectionName,
    }),
  }).then((response) => {
    if (response.status == 200) {
      console.log("Sikeresen törölve!");
    }
  });
}
export function deleteItem(itemName) {
  console.log("lefut");
  fetch(url + "/deleteitem", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: itemName,
    }),
  }).then((response) => {
    if (response.status == 200) {
      console.log("Sikeresen törölve!");
    }
  });
}

fetchCollections();
fetchItems();

document
  .getElementById("newCollButton")
  ?.addEventListener("click", insertCollection);

document.getElementById("newItemButton")?.addEventListener("click", insertItem);
document.body.addEventListener("load", renderCard);

setTimeout(() => {
  loadingSpinner.style.display = "none";
  renderCard();
}, 1000);
