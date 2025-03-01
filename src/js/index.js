const url = "http://localhost:8080";

var selectedCollectionId = -1;

const cardsContainer = document.querySelector(".cards-container");
const heroContainer = document.querySelector(".hero");
const collectionHero = document.querySelector(".collectionHero");
const selectedCollectionElement = document.querySelector(
  ".selected-collection"
);
const loadingSpinner = document.getElementById("loading");
const itemWindow = document.getElementById("newItemWindow");
const successCollectionAlert = document.getElementById(
  "success-collection-alert"
);
const successItemAlert = document.getElementById("success-item-alert");
const successDeleteItemAlert = document.getElementById(
  "success-delete-item-alert"
);
const renameCollAlert = document.getElementById("success-renameColl-alert");
const renameItemAlert = document.getElementById("success-renameItem-alert");
const moveItemAlert = document.getElementById("success-move-item-alert");

async function fetchCollections() {
  try {
    let response = await fetch(url + "/collections");
    let data = await response.json();
    localStorage.setItem("collections", JSON.stringify(data));
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

async function fetchItems() {
  try {
    let response = await fetch(url + "/items");
    let data = await response.json();
    localStorage.setItem("items", JSON.stringify(data));
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }
}

export const renderCard = () => {
  const collections = JSON.parse(localStorage.getItem("collections"));
  collections.map((collection) => {
    const cardElement = document.createElement("div");
    const renameId = "rename" + collection.name;
    cardElement.innerHTML = `
    <div class="card p-1 card-width">
        <img src="./src/assets/images/Default.png" class="card-img-top" alt="..."/>
        <div class="card-body">
            <h5 class="card-title">${collection.name}</h5>
            <p class="card-text">${collection.theme}</p>
            <button id="${collection.name}" class="btn bg-mozaik text-white">Megnyitás</button>
            <button id="${renameId}" class="btn bg-secondary position-absolute end-0 me-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
            </button>
        </div>
    </div>
    `;

    cardsContainer.appendChild(cardElement);

    const renameBtn = document.getElementById(renameId);
    renameBtn?.addEventListener("click", () => {
      renameCollDialog(collection.name);
    });

    const button = document.getElementById(collection.name);
    button?.addEventListener("click", () => {
      openCollection(collection.name);
    });
  });
};

function renameCollDialog(collectionName) {
  $("#reNameModalLabel").html(collectionName + " átnevezése");
  $("#newCollName").val(collectionName);
  $("#renameCollDialog").modal("show");
}

function renameItemDialog(itemName) {
  $("#reNameItemModalLabel").html(itemName + " átnevezése");
  $("#newItemName").val(itemName);
  $("#reNameItemDialog").modal("show");
}

function moveItemDialog(itemName) {
  $("#moveItemModalLabel").html(itemName + " áthelyezése");
  let collections = JSON.parse(localStorage.getItem("collections"));
  var select = document.getElementById("select");

  var selectList = document.createElement("select");
  selectList.setAttribute("id", "selectCollection");
  selectList.setAttribute("class", "form-select");
  select.appendChild(selectList);

  collections.map((collection) => {
    var option = document.createElement("option");
    option.setAttribute("value", collection.name);
    option.text = collection.name;
    selectList.appendChild(option);
  });
  $("#moveItemDialog").modal("show");
}

async function renameCollection() {
  const label = document.getElementById("reNameModalLabel").innerHTML;
  const myArray = label.split(" ");
  let collectionName = myArray[0];
  let collectionId = "";
  let collections = JSON.parse(localStorage.getItem("collections"));
  collections.map((collection) => {
    if (collection.name === collectionName) {
      collectionId = collection._id;
    }
  });

  const newName = $("#newCollName").val();

  if (newName !== "" && typeof newName === "string") {
    await fetch(url + "/update/collection", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        collectionId: collectionId,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          renderCard();
          renameCollAlert.style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Mindeképp adj meg adatot!");
  }
}

async function renameItem() {
  const label = document.getElementById("reNameItemModalLabel").innerHTML;
  const myArray = label.split(" ");
  let itemName = myArray[0];
  let itemId = "";
  let items = JSON.parse(localStorage.getItem("items"));
  items.map((item) => {
    if (item.name === itemName) {
      itemId = item._id;
    }
  });

  const newName = $("#newItemName").val();

  if (newName !== "" && typeof newName === "string") {
    await fetch(url + "/update/item", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        itemId: itemId,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          renderCard();
          renameItemAlert.style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Adj meg mindenképp adatot!");
  }
}

async function moveItem() {
  const label = document.getElementById("moveItemModalLabel").innerHTML;
  const myArray = label.split(" ");
  let itemName = myArray[0];
  let itemId = "";
  let items = JSON.parse(localStorage.getItem("items"));

  items.map((item) => {
    if (item.name === itemName) {
      itemId = item._id;
    }
  });

  const selectedCollection = $("#selectCollection option:selected").text();

  let selectedCollectionID = 0;
  let collections = JSON.parse(localStorage.getItem("collections"));
  collections.map((collection) => {
    if (selectedCollection == collection.name) {
      selectedCollectionID = collection.collectionId;
    }
  });

  if (
    selectedCollection !== "" &&
    typeof selectedCollection === "string" &&
    selectedCollectionID !== 0
  ) {
    await fetch(url + "/move/item", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: itemId,
        collectionId: selectedCollectionID,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          renderCard();
          moveItemAlert.style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function openCollection(collectionName) {
  let collections = JSON.parse(localStorage.getItem("collections"));
  const selectedCollection = collections.find(
    (collection) => collection.name == collectionName
  );
  selectedCollectionId = selectedCollection.collectionId;

  cardsContainer.style.display = "none";
  heroContainer.style.display = "none";

  document.getElementById("collectionNameH").innerHTML = collectionName;

  let items = JSON.parse(localStorage.getItem("items"));

  items.map((item) => {
    if (item.collectionId == selectedCollectionId) {
      const collectionItem = document.createElement("div");
      const updatenameID = "nameBTN" + item.name;
      const deleteID = "deleteBTN" + item.name;
      const moveID = "moveBTN" + item.name;
      collectionItem.innerHTML = `
    <div class="card itemCard p-3">
        <img src="./src/assets/images/Default.png" class="card-img-top" alt="..."/>
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
        deleteItem(item.name);
      });
      updateBtn.addEventListener("click", () => {
        renameItemDialog(item.name);
      });
      moveBtn.addEventListener("click", () => {
        moveItemDialog(item.name);
      });
    }
  });
  selectedCollectionElement.style.display = "grid";
  itemWindow.style.display = "grid";
  collectionHero.style.display = "block";
}

export async function insertCollection() {
  const name = document.getElementById("name").value;
  const theme = document.getElementById("theme").value;
  const date = document.getElementById("date").value;

  if (
    name !== "" &&
    theme !== "" &&
    date !== "" &&
    typeof name === "string" &&
    typeof theme === "string"
  ) {
    let collectionId = 0;
    let collections = JSON.parse(localStorage.getItem("collections"));
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
          fetchCollections();
          renderCard();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Nem jol megadott paraméterek");
  }
}
export function insertItem() {
  const name = document.getElementById("itemName").value;
  if (name !== "" && typeof name === "string") {
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
          renderCard();
          successItemAlert.style.display = "block";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Nem jól megadott paraméterek");
  }
}

/*export function deleteCollection(collectionName) {
  fetch(url + "/delete/collection", {
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
}*/

export function deleteItem(itemName) {
  fetch(url + "/delete/item", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: itemName,
    }),
  }).then((response) => {
    if (response.status == 200) {
      renderCard();
      successDeleteItemAlert.style.display = "block";
    }
  });
}

fetchCollections();
fetchItems();

document
  .getElementById("newCollButton")
  ?.addEventListener("click", insertCollection);

document.getElementById("newItemButton")?.addEventListener("click", insertItem);
document.getElementById("moveItemButton")?.addEventListener("click", moveItem);
document
  .getElementById("renameCollButton")
  ?.addEventListener("click", renameCollection);

document
  .getElementById("renameItemButton")
  ?.addEventListener("click", renameItem);

setTimeout(() => {
  loadingSpinner.style.display = "none";
  renderCard();
}, 600);

document.addEventListener("hidden.bs.modal", function (event) {
  if (document.activeElement) {
    document.activeElement.blur();
  }
});
