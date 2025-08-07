const carousel = document.getElementById("anime-carousel");
const featured = document.getElementById("featured");
const searchInput = document.getElementById("search");

async function loadAnimes(query = "One Piece") {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=15`);
    const data = await res.json();

    carousel.innerHTML = "";

    data.data.forEach((anime, index) => {
      const card = document.createElement("div");
      card.className = "anime-card";
      card.innerHTML = `
  <div class="anime-clickable" data-id="${anime.mal_id}">
    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
    <h3>${anime.title}</h3>
  </div>
`;


      carousel.appendChild(card);

      // El primero se muestra como destacado
      if (index === 0) {
        const backgroundUrl = anime.trailer?.images?.maximum_image_url || anime.images.jpg.large_image_url;
        featured.style.backgroundImage = `url(${backgroundUrl})`;
        featured.innerHTML = `
          <h2>${anime.title}</h2>
          <p>${anime.synopsis?.substring(0, 200) || "Sinopsis no disponible."}</p>
        `;
      }
    });
  } catch (error) {
    console.error("Error al cargar los animes:", error);
  }
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length >= 3) {
    loadAnimes(query);
  }
});

loadAnimes();
carousel.addEventListener("click", async (e) => {
  const card = e.target.closest(".anime-clickable");
  if (!card) return;

  const animeId = card.getAttribute("data-id");
  if (!animeId) return;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await res.json();
    const anime = data.data;

    const detail = document.getElementById("anime-detail");
    detail.style.display = "block";
    detail.innerHTML = `
      <div class="detail-banner" style="background-image: url('${anime.images.jpg.large_image_url}')"></div>
      <div class="detail-content">
        <h2>${anime.title}</h2>
        <p><strong>Sinopsis:</strong> ${anime.synopsis || "Sin sinopsis disponible."}</p>
        <p><strong>Tipo:</strong> ${anime.type}</p>
        <p><strong>Episodios:</strong> ${anime.episodes || "Desconocido"}</p>
        <p><strong>Estado:</strong> ${anime.status}</p>
        <p><strong>Puntuación:</strong> ⭐ ${anime.score || "Sin puntuación"}</p>
        <p><strong>Fecha de emisión:</strong> ${anime.aired.string}</p>
        <p><strong>Estudio(s):</strong> ${anime.studios.map(s => s.name).join(", ")}</p>

        ${anime.trailer.embed_url ? 
          `<h3>Tráiler</h3>
           <iframe width="100%" height="350" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>`
         : "<p><strong>Tráiler:</strong> No disponible</p>"}
      </div>
    `;
    // Scroll hacia el detalle
    detail.scrollIntoView({ behavior: "smooth" });

  } catch (error) {
    console.error("Error al cargar los detalles del anime:", error);
  }
});
