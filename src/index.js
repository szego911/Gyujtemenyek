let collections = [];
let items = [];

fetch("http://localhost:8080/collections")
  .then((response) => response.json())
  .then((collectionsData) => {
    collectionsData.forEach((collection) => collections.push(collection));
  });

fetch("http://localhost:8080/items")
  .then((response) => response.json())
  .then((itemsData) => {
    itemsData.forEach((item) => items.push(item));
  });

console.log(items);
console.log(collections);

const cardsContainer = document.querySelector(".cards-container");
const heroContainer = document.querySelector(".hero");
const renderCard = () => {
  collections.map((collection) => {
    console.log(collection);
    const cardElement = document.createElement("div");
    cardElement.innerHTML = `
    <div class="card p-3">
        <img src="../assets/Diplomatico.png" class="card-img-top" alt="..."/>
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
renderCard();

function addOrUpdateURLParam(key, value) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

const selectedCollectionElement = document.querySelector(
  ".selected-collection"
);

function openCollection(collectionName) {
  addOrUpdateURLParam("collection", collectionName);
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
        <img src="/assets/images/Diplomatico.png" class="card-img-top" alt="..."/>
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
