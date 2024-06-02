document.addEventListener("DOMContentLoaded", function () {
  const mangaList = document.getElementById("mangaList");

  // Cargar datos desde el archivo JSON (usando Fetch API)
  fetch("datos/mangas.json")
    .then((response) => response.json())
    .then((data) => {
      const mangas = data.mangas;
      renderMangaCards(mangas, mangaList);
    })
    .catch((error) => console.error("Error al cargar datos:", error));
});

function renderMangaCards(mangas, container) {
  mangas.forEach((manga) => {
    const mangaCard = createMangaCard(manga);
    container.appendChild(mangaCard);
  });
}

function createMangaCard(manga) {
  const mangaCard = document.createElement("article");
  mangaCard.className = "manga-card";

  const coverImage = document.createElement("img");
  coverImage.src = manga.cover;
  coverImage.className = "cover-image";
  mangaCard.appendChild(coverImage);

  const characterImage = document.createElement("img");
  characterImage.src = manga.character;
  characterImage.className = "character-image";
  mangaCard.appendChild(characterImage);

  const titleImage = document.createElement("img");
  titleImage.src = manga.title;
  titleImage.className = "title-image";
  titleImage.onclick = () => openModal(manga);
  mangaCard.appendChild(titleImage);

  return mangaCard;
}

// Función para abrir la ventana modal con los detalles del manga
function openModal(selectedManga) {
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSummary = document.getElementById("modalSummary");

  modalTitle.src = selectedManga.title;
  modalTitle.className = "title-modal-image";
  modalSummary.innerHTML = "";
  selectedManga.tomos.forEach((tomo) => {
    const mangaTomo = createMangaTomo(tomo);

    modalSummary.appendChild(mangaTomo);
  });

  modal.style.display = "block";

  // Botón para cerrar la ventana modal
  const closeModalBtn = document.getElementsByClassName("close")[0];
  closeModalBtn.onclick = () => (modal.style.display = "none");

  // Cierra la ventana modal si se hace clic fuera de ella
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function createMangaTomo(tomo) {
  const tomos = document.createElement("li");
  tomos.textContent = tomo.titulo;
  return tomos;
}
