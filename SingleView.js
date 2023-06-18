import { default as axios } from "https://cdn.skypack.dev/axios@latest";
const url = "https://www.omdbapi.com/?apikey=55500ef&";
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get("imdbID");
const title = document.getElementById("title");
const actors = document.getElementById("actors");
const genre = document.getElementById("genre");
const poster = document.getElementById("poster");
const plot = document.getElementById("plot");
const rating = document.getElementById("rating");
const released = document.getElementById("released");
const type = document.getElementById("type");
const backButton = document.getElementById("backButton");

backButton.addEventListener("click", goBack);

function goBack() {
  window.history.back();
}

function fetchSingleMovie(imdbID) {
  axios
    .get(`${url}i=${imdbID}`)
    .then((response) => {
      if (response.status === 200) {
        title.innerHTML = response.data.Title;
        actors.innerHTML = response.data.Actors;
        genre.innerHTML = response.data.Genre;
        plot.innerHTML = response.data.Plot;
        rating.innerHTML = response.data.imdbRating;
        released.innerHTML = response.data.Released;
        const capitalizedType =
          response.data.Type.charAt(0).toUpperCase() +
          response.data.Type.slice(1);
        type.innerHTML = capitalizedType;
        poster.src = response.data.Poster;
        poster.alt = response.data.Title;
      }
    })
    .catch((error) => {
      errorMessage.innerHTML = error.message;
    });
}

fetchSingleMovie(imdbID);
