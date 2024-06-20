const apiKey = "b126b7fb-040f-494b-81eb-face8df8dd40";
const apiUrlTopCartoons = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=KIDS_ANIMATION_THEME&page=1";
const apiUrlDetails = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const apiSearch = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const searchForm = document.querySelector('.header-form');
const searchInput = document.querySelector('.header-search');


getCartoons(apiUrlTopCartoons);

async function getCartoons(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
        }
    });
    const respData = await resp.json();
    console.log(respData)
    showCartoons(respData)
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showCartoons(data) {
    const cartoonsEl = document.querySelector('.cartoons');

    cartoonsEl.innerHTML = "";

    data.items.forEach((cartoon)=>{
        const cartoonEl = document.createElement("div");
        cartoonEl.classList.add("cartoon");
        cartoonEl.innerHTML = `
        <div class="cartoon__cover-inner">
            <img
              src="${cartoon.posterUrlPreview}"
              alt="${cartoon.nameRu}"
              class="cartoon-cover"
            />
            <div class="cartoon-cover_darkened"></div>
          </div>
          <div class="cartoon__info">
            <div class="cartoon__title">${cartoon.nameRu}</div>
            <div class="cartoon__category">${cartoon.genres.map((genre) => ` ${genre.genre}`)}</div>
            <div class="cartoon__average cartoon__average_${getClassByRate(cartoon.ratingImdb)}">${cartoon.ratingImdb}</div>
          </div>
        `
        cartoonEl.addEventListener('click', ()=> openModal(cartoon.kinopoiskId))
        cartoonsEl.appendChild(cartoonEl);
    })

}

//Поиск по ключевому слову

async function getVideoByKeyword(url) {
  const resp = await fetch(url, {
      headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
      }
  });
  const respData = await resp.json();
  console.log(respData)
  showVideoByKeyword(respData)
}


function showVideoByKeyword(data) {
  const cartoonsEl = document.querySelector('.cartoons');

  cartoonsEl.innerHTML = "";

  data.films.forEach((cartoon)=>{
      const cartoonEl = document.createElement("div");
      cartoonEl.classList.add("cartoon");
      cartoonEl.innerHTML = `
      <div class="cartoon__cover-inner">
          <img
            src="${cartoon.posterUrlPreview}"
            alt="${cartoon.nameRu}"
            class="cartoon-cover"
          />
          <div class="cartoon-cover_darkened"></div>
        </div>
        <div class="cartoon__info">
          <div class="cartoon__title">${cartoon.nameRu}</div>
          <div class="cartoon__category">${cartoon.genres.map((genre) => ` ${genre.genre}`)}</div>
          <div class="cartoon__average cartoon__average_${getClassByRate(cartoon.rating)}">${cartoon.rating}</div>
        </div>
      `
      cartoonEl.addEventListener('click', ()=> openModal(cartoon.filmId))
      cartoonsEl.appendChild(cartoonEl);
  })

}

searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const searchUrl = `${apiSearch}${searchInput.value}`;
  if(searchInput.value) {
    
    getVideoByKeyword(searchUrl);
    searchInput.value = "";
  }
})

//модальное окно

const modalEl = document.querySelector('.modal');

async function openModal(id) {
  const resp = await fetch(apiUrlDetails + id, {
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
    }
});
const respData = await resp.json();
modalEl.classList.add("modal-show")
document.body.classList.add("stop-scrolling")
modalEl.innerHTML = `
<div class="modal__card">
      <img class="modal__cartoon-backdrop" src="${respData.posterUrl}" alt="${respData.nameRu}">
      <h2>
        <div class="modal__cartoon-title"> ${respData.nameRu}</div>
      </h2>
      <ul class="modal__cartoon-info">
        <div class="loader"></div>
        <li class=""modal__cartoon-release-year">Год - ${respData.year}</li>
        <li class="modal__cartoon-genre">Жанр - ${respData.genres.map((genre) => ` ${genre.genre}`)}</li>
        <li class="modal__cartoon-country">Страна - ${respData.countries.map((el)=>`<span> ${el.country} </span>`)}</li>
        <li class="modal__cartoon-overview">Описание - ${respData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
`
const btnCloseModal = document.querySelector('.modal__button-close')
btnCloseModal.addEventListener("click", ()=> closeModal())
}

function closeModal(){
  modalEl.classList.remove("modal-show")
  document.body.classList.remove("stop-scrolling")
}

window.addEventListener('click', (e)=>{
  if (e.target === modalEl) {
    closeModal()
  }
})