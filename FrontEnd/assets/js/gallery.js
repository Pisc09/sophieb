let projets;
const galerie = fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    projets = data;
    data.forEach((element) => {
      createProject(element);
    });
  });

let btnCategoriesData;
const btnCategories = fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((data) => {
    btnCategoriesData = data;
    const btnTous = { id: 0, name: "Tous" };
    btnCategoriesData.unshift(btnTous);

    for (let i = 0; i < btnCategoriesData.length; i++) {
      const btns = document.createElement("button");
      btns.innerText = btnCategoriesData[i].name;
      btns.classList.add("categories-btn");
      if (btnCategoriesData[i].name === "Tous") {
        btns.classList.add("active");
      }

      navCategories.appendChild(btns);

      btns.addEventListener("click", () => {
        document.querySelectorAll(".categories-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        btns.classList.add("active");

        filterCategory(btnCategoriesData[i].id);
      });
    }
  });

const navCategories = document.getElementById("filtres"); // Balise nav pour les boutons Tous - Objets - Appartements - Hotels & restaurant
// console.log(navCategories);
navCategories.classList.add("categories");

const gallery = document.querySelector(".gallery");

let state = {};
// Réalisation des éléments (images et textes) qui seront affichés dans le DOM, donc dans la page web
function createProject(projet) {
  console.log(projet);
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const fgCaption = document.createElement("figcaption");

  image.src = projet.imageUrl;
  fgCaption.innerText = projet.title;
  // Ajouter les éléments au DOM
  figure.appendChild(image);
  figure.appendChild(fgCaption);
  gallery.appendChild(figure);

  state[projet.id] = { figure };
}

function filterCategory(idCategory) {
  const filterProject =
    idCategory > 0
      ? projets.filter((item) => item.categoryId === idCategory)
      : projets;
  gallery.innerHTML = "";
  filterProject.forEach((element) => {
    createProject(element);
  });
}

window.addEventListener("message", (e) => {
  if (e.origin !== "http://localhost:5678") return;

  const data = e.data;
  const newImage = document.createElement("img");
  newImage.src = data.image;
  newImage.alt = data.title;
  newImage.classList.add(data.category);
  document.querySelector(".gallery").appendChild(newImage);
});

if (localStorage.getItem("token")) {
  const topBarEdit = document.querySelector(".top-bar-edit");
  topBarEdit.style.display = "flex";

  const logOut = document.querySelector("#log");
  logOut.textContent = "logout";

  const groupe = document.querySelector(".groupe");
  groupe.style.marginBottom = "20px";

  const btnEdit = document.querySelector(".btn-edit");
  btnEdit.style.display = "flex";

  document.body.style.paddingTop = "50px";

  const navFilters = document.querySelector("#filtres");
  if (navFilters) {
    navFilters.style.display = "none";
  }
}

const btnLogOut = document.querySelector("#log");

btnLogOut.addEventListener("click", () => {
  localStorage.removeItem("token");

  window.location.href = "index.html";
});

/*** modifs.js ******************** */

const popupEdit = document.querySelector(".popup-edit");

const closePopup = document
  .querySelector(".fa-xmark")
  .addEventListener("click", () => {
    popupEdit.style.display = "none";
  });

const iconArrowLeft = document.querySelector(".fa-arrow-left");
iconArrowLeft.addEventListener("click", () => {
  popupFormEdit.style.display = "none";
  popupPhotoDelete.style.display = "flex";
  iconArrowLeft.style.visibility = "hidden";
});

const popupFormEdit = document.getElementById("formulaire-popup");
const btnEdit = document.querySelector(".btn-edit");
btnEdit.addEventListener("click", () => {
  popupEdit.style.display = "flex";
  popupFormEdit.style.display = "flex";
  popupPhotoDelete.style.display = "none";
  iconArrowLeft.style.visibility = "visible";
});
const btnAjouterPhoto = document.querySelector(".categories-btn-photo");
btnAjouterPhoto.addEventListener("click", () => {
  popupEdit.style.display = "flex";
  popupFormEdit.style.display = "flex";
  popupPhotoDelete.style.display = "none";
  iconArrowLeft.style.visibility = "visible";
});

const popupPhotoDelete = document.querySelector(".photo-div");
console.log(popupPhotoDelete);
const btnTopEdit = document.querySelector(".top-bar-edit");
btnTopEdit.addEventListener("click", () => {
  titrePopup.innerText = "Galerie photo";
  popupEdit.style.display = "flex";
  popupFormEdit.style.display = "none";
  popupPhotoDelete.style.display = "flex";
  iconArrowLeft.style.visibility = "hidden";
});

const titrePopup = document.querySelector(".popup-titre");
console.log(titrePopup);
const traitHr = document.querySelector(".photo-div hr");
const photosDelete = document.querySelector(".photos-delete");
console.log(photosDelete);

function createGaleriePhotos(photo) {
  const spanDiv = document.createElement("span");
  const imageImg = document.createElement("img");
  const iconeDelete = document.createElement("i");

  spanDiv.classList.add("photo-span");
  imageImg.classList.add("photo-dimension");
  iconeDelete.classList.add("fa-solid");
  iconeDelete.classList.add("fa-trash-can");

  imageImg.src = photo.imageUrl;

  spanDiv.appendChild(imageImg);
  spanDiv.appendChild(iconeDelete);
  photosDelete.appendChild(spanDiv);

  popupPhotoDelete.insertBefore(photosDelete, traitHr.previousSibling);

  state[photo.id].spanDiv = spanDiv;

  iconeDelete.addEventListener("click", () => {
    deleteWithAuth(photo.id).then(() => {
      state[photo.id].spanDiv.remove();
      state[photo.id].figure.remove();
    });
  });
}

function deleteWithAuth(id) {
  const token = window.localStorage.getItem("token");
  return fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Vérifiez si la réponse a un corps avant de tenter de le convertir en JSON
      if (response.status === 204) {
        // 204 No Content
        return;
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data) {
        console.log(data);
      } else {
        console.log("No content returned");
      }
    })
    .catch((error) => console.error("There was an error!", error));
}

let photoDelete;
const galeriePhoto = fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((data) => {
    photoDelete = data;
    photoDelete.forEach((photos) => {
      createGaleriePhotos(photos);
    });
  });

const loadFile = document.querySelector("#monFichier");

const imageInput = document.querySelector(".image-input");

const preview = document.querySelector(".image-preview");

imageInput.addEventListener("click", () => {
  loadFile.click();
});

loadFile.addEventListener("change", function () {
  if (this.files && this.files.length > 0) {
    let file = this.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;

      imageInput.style.display = "none";
    };

    reader.readAsDataURL(file);
  }
});

const formulaire = document.querySelector("#formulaire-popup");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#maListe");

let listeCategorie;
const selectCategories = fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    listeCategorie = data;
    // console.log(listeCategorie);
    const veuillezChoix = { id: 0, name: "Veuillez choisir une catégorie" };
    listeCategorie.unshift(veuillezChoix);

    for (let i = 0; i < listeCategorie.length; i++) {
      const nomCat = listeCategorie[i].name;
      // console.log(nomCat);
      const optionCat = document.createElement("option");
      optionCat.innerText = listeCategorie[i].name;
      optionCat.value = listeCategorie[i].id;
      // console.log(optionCat);
      categorySelect.appendChild(optionCat);
      console.log(categorySelect);
    }
  });

const btnValider = document.querySelector(".pointeur");
console.log(btnValider);

// if (titleInput.value.trim() === "" && categorySelect.value.trim() === "") {
//   btnValider.disabled = true;
//   btnValider.classList.add("disabled");
// }

// if (titleInput.value.trim() !== "" && categorySelect.value.trim() !== "") {
//   btnValider.disabled = false;
//   btnValider.classList.remove("disabled");
// }

formulaire.addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le comportement de soumission par défaut

  // Crée un objet FormData pour contenir les données du formulaire
  const formData = new FormData();
  formData.append("image", loadFile.files[0]); // Ajoute le fichier image
  formData.append("title", titleInput.value); // Ajoute le titre
  formData.append("category", categorySelect.value); // Ajoute la catégorie

  // Envoie les données du formulaire à l'API
  const token = window.localStorage.getItem("token");
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createProject(data);
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
});

function updateButtonState() {
  if (titleInput.value.trim() !== "" && categorySelect.value !== "0") {
    btnValider.disabled = false;
    btnValider.classList.remove("disabled");
  } else {
    btnValider.disabled = true;
    btnValider.classList.add("disabled");
  }
}

titleInput.addEventListener("input", updateButtonState);
categorySelect.addEventListener("change", updateButtonState);

updateButtonState();
