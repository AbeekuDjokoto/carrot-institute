import { default as axios } from "https://cdn.skypack.dev/axios@latest";

const url = "https://www.omdbapi.com/?apikey=55500ef&";
const form = document.forms.search;
const sortSelect = form.sortSelect;
const input = form.searchInput;
const title = document.getElementById("title");
const errorMessage = document.getElementById("error-message");
const pagination = document.getElementById("pagination");
const paginationList = document.getElementById("pagination-list");

form.addEventListener("submit", search, false);
sortSelect.addEventListener("change", sortResults, false);

const dataStore = [];
let searchValue = "";
const resultsPerPage = 10;
let currentPage = 1;

function sortResults() {
  const sortBy = sortSelect.value;
  const aboutToSort = [...dataStore];

  if (sortBy === "year") {
    let sortedMovies = aboutToSort.sort((a, b) => b.Year.localeCompare(a.Year));
    renderMovies(sortedMovies);
  } else if (sortBy === "type") {
    let sortedMovies = aboutToSort.sort((a, b) => b.Type.localeCompare(a.Type));
    renderMovies(sortedMovies);
  }
}

function renderMovies(movieArray) {
  title.innerHTML = "";
  movieArray.forEach(({ Title, Poster, Type, Year, imdbID }) => {
    const capitalizedType = Type.charAt(0).toUpperCase() + Type.slice(1);

    const result = document.createElement("div");
    result.classList.add("result");
    result.addEventListener("click", () => fetchSingleView(imdbID));

    const innerHTML = `
      <figure class="img--container">
        <img src=${Poster} alt=${Title} />
      </figure>
      <div>
        <h3 class="title">${Title}</h3>
        <p class="sub--title">${capitalizedType}: ${Year}</p>
      </div>
    `;

    result.innerHTML = innerHTML;
    title.appendChild(result);
  });
}

function search(e) {
  e.preventDefault();
  searchValue = input.value;

  dataStore.length = 0;

  if (searchValue.length < 3) {
    errorMessage.innerText = "Sorry, the characters should be more than two";
    title.innerHTML = "";
    clearPagination();
  } else {
    axios
      .get(`${url}s=${searchValue}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.Response === "False") {
            errorMessage.innerHTML = response.data.Error;
            title.innerHTML = "";
            clearPagination();
          } else {
            errorMessage.innerHTML = "";
            const movieArray = response.data.Search;

            renderMovies(movieArray);
            dataStore.push(...movieArray);
            sortResults();
            if (response.data.Error === "Movie not found!") {
              console.log("do nothing");
            } else {
              searchPagination();
            }
          }
        }
      })
      .catch((error) => {
        errorMessage.innerHTML = error.message;
        pagination.style.display = "none";
      })
      .finally(() => {
        input.value = "";
        // searchPagination();
      });
  }
}

function clearPagination() {
  while (paginationList.firstChild) {
    paginationList.firstChild.remove();
  }
}

function renderPagination(paginationLength) {
  clearPagination();
  for (let i = 1; i <= paginationLength; i++) {
    const paginationItem = document.createElement("div");
    paginationItem.classList.add("pagination__item");

    const paginationButton = document.createElement("button");
    paginationButton.classList.add("pagination__btn");
    paginationButton.addEventListener("click", () => searchPagination(i));

    const paginationText = document.createElement("span");
    paginationText.classList.add("pagination__text");
    paginationText.innerText = i;

    paginationButton.appendChild(paginationText);
    paginationItem.appendChild(paginationButton);
    paginationList.appendChild(paginationItem);
  }
}

function searchPagination(value) {
  console.log("value", value);
  dataStore.length = 0;
  let paginationLength = 0;
  currentPage = value;

  axios
    .get(`${url}s=${searchValue}&page=${currentPage}`)
    .then((response) => {
      if (response.status === 200) {
        if (response.data.Response === "False") {
          errorMessage.innerHTML = response.data.Error;
          title.innerHTML = "";

          pagination.style.display = "none";
        } else {
          errorMessage.innerHTML = "";
          const movieArray = response.data.Search;
          let toNumber = Number(response.data.totalResults);
          paginationLength = Math.ceil(toNumber / resultsPerPage);
          renderPagination(paginationLength);

          renderMovies(movieArray);
          dataStore.push(...movieArray);
          sortResults();
        }
      }
    })
    .catch((error) => {
      errorMessage.innerHTML = error.message;
      pagination.style.display = "none";
    })
    .finally(() => {
      input.value = "";
    });
}

function fetchSingleView(data) {
  const singleViewURL = `./SingleView.html?imdbID=${data}`;
  window.location.href = singleViewURL;
}
