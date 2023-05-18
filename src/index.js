import './css/common.css';
import LoadMoreBtn from './components/LoadMoreBtn.js';
import AxiosRequest from './js/axiosRequest';
import { Notify } from 'notiflix/build/notiflix-notify-aio'; //для сообщений
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const cardsContainer = document.querySelector('.gallery');
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', onLoadMore);

const axiosRequest = new AxiosRequest();

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSearch(e) {
  e.preventDefault();
  axiosRequest.query = e.currentTarget.searchQuery.value.trim();
  axiosRequest.resetPage();
  clearCards();

  if (axiosRequest.query === '') {
    loadMoreBtn.hide();
    alert('No data');
  } else {
    loadMoreBtn.show();
    loadMoreBtn.disable();
    const response = await axiosRequest.fetchElement();
    Notify.success(`Hooray! We found ${axiosRequest.totalHits} images.`);
    onCurrentHits(response);
  }
}

function renderCard(cards) {
  if (cards.length === 0) {
    onFitchError();
  } else {
    const markup = cards
      .map(
        ({
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<div class="photo-card">
            <a class="gallery__item" href="${largeImageURL}">
              <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b><br>${likes}
              </p>
              <p class="info-item">
                <b>Views</b><br>${views}
              </p>
              <p class="info-item">
                <b>Comments</b><br>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b><br>${downloads}
              </p>
            </div>
          </div>
          `
      )
      .join('');

    cardsContainer.insertAdjacentHTML('beforeend', markup);
  }
  loadMoreBtn.enable();
}

async function onLoadMore() {
  loadMoreBtn.disable();
  const response = await axiosRequest.fetchElement();
  onCurrentHits(response);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onCurrentHits(response) {
  let currentHits = response.length;
  if (currentHits >= 40) {
    loadMoreBtn.show();
  } else {
    loadMoreBtn.hide();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  renderCard(response);
  lightbox.refresh();
}

//Отчистить вывод
function clearCards() {
  cardsContainer.innerHTML = '';
}

function onFitchError() {
  loadMoreBtn.hide();
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      showOnlyTheLastOne: true,
    }
  );
}
