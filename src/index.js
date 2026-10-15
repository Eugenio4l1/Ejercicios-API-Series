const ID = new URLSearchParams(location.search).get("id") ?? "3200";
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");


const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return response.json();
};

const getShowData = async (id) => {
  const data = await fetchJSON(`https://api.tvmaze.com/shows/${id}`);

  return {
    name: data.name,
    rating: data.rating?.average ?? null,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

const getEpisodeList = async (id) => {
  const episodes = await fetchJSON(`https://api.tvmaze.com/shows/${id}/episodes`);

  const episodeList = episodes
    .filter((episode) => episode.number !== null) // ignora especiales
    .map((episode) => ({
      number: episode.number,
      season: episode.season,
      rating: episode.rating?.average ?? null
    }));

  return Object.groupBy(episodeList, (episode) => episode.season);
};

// ---------- Render ----------

const ratingClass = (rating) => `rating-${Math.floor(rating ?? 0)}`;
const pad = (n) => String(n).padStart(2, "0");

const createHeaderHTML = ({ name, image, rating }) => /* html */`
  <img class="poster" src="${image}" alt="Póster de ${name}">
  <h1>${name}</h1>
  <p class="show-rating">★ ${rating ?? "N/A"}</p>
`;

const createEpisodeHTML = ({ number, rating }) => /* html */`
  <div class="episode episode-${number} ${ratingClass(rating)}"
       title="Episodio ${number} · Rating: ${rating ?? "N/A"}">${number}</div>
`;

const createSeasonHTML = (data, number) => /* html */`
  <article class="season">
    <header class="season-header">T${pad(number)}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;

try {
  const [show, seasons] = await Promise.all([
    getShowData(ID),
    getEpisodeList(ID)
  ]);

  document.title = show.name;
  $header.setHTMLUnsafe(createHeaderHTML(show));

  const list = Object.entries(seasons).map(([number, season]) =>
    createSeasonHTML(season, number)
  );
  $episodes.setHTMLUnsafe(list.join(""));
} catch (error) {
  console.error("Error al obtener los datos: ", error);
  $header.textContent = "No se pudieron cargar los datos";
}
