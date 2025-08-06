const carousel = document.getElementById("anime-carousel");
const featured = document.getElementById("featured");
const searchInput = document.getElementById("search");

async function loadAnimes(query= "One Piece") {
  const res = await fetch(https://api.jikan.moe/v4/anime?q=${query}&limit=15);
  const data = await res.json();

  carousel.innerHTML = "";

  data.data.forEach((anime, index) => {
    const card = document.createElement("div");
    card.className = "anime-card";
   card.innerHTML = 
  <a href="detalle.html?id=${anime.mal_id}">
    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
    <h3>${anime.title}</h3>
  </a>
;

    carousel.appendChild(card);

    // El primero se muestra como destacado
    if (index === 0) {
     featured.style.backgroundImage = url(${anime.trailer.images.maximum_image_url || anime.images.jpg.large_image_url});
      featured.innerHTML = 
        <h2>${anime.title}</h2>
        <p>${anime.synopsis?.substring(0, 200) || "Sinopsis no disponible."}</p>
      ;
    }
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length >= 3) {
    loadAnimes(query);
  }
});

loadAnimes();

