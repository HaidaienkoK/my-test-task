import axios from 'axios';

const cardsContainer = document.querySelector('.cards');
var cardsData = '';
// const dataCardsOb = {
//   user: '',
//   tweets: '',
//   folowers: '',
//   avatar: '',
//   id: '',
// };
// console.log(cardEL)

function fetchData() {
  console.log('dsfkjajfhashfjkhads');
  axios
    .get('https://6457709a1a4c152cf981ff55.mockapi.io/DDsd')
    .then(function (response) {
      // Обработка успешного ответа от сервера
      console.log(response.data);
      cardsData = response.data;
      var jsonString = JSON.stringify(cardsData);
      localStorage.setItem('Data', jsonString);
      renderCards(cardsData);
      const buttonElAll = document.querySelectorAll('.button');
      console.log(buttonElAll);
      buttonElAll.forEach(function (item) {
        /* Назначаем каждой кнопке обработчик клика */
        item.addEventListener('click', clickItem);
      });
    })
    .catch(function (error) {
      // Обработка ошибки
      console.log(error);
    });
}

function renderCards(cardsData) {
  cardsContainer.innerHTML = '<ul class="cards"></ul>';
  const markup = cardsData
    .map(
      cardData =>
        `<li class="card">
        <div class="box">

        <div class="logo"></div>
          <div class="top_img"></div>
          <div class="line"></div>
          <img class="avatar" src='${cardData.avatar}' alt="">
          <p class="tweets">${cardData.tweets} TWEETS</p>
          <p class="followers"  id=${
            cardData.id + 'p'
          }>${cardData.followers.toLocaleString('en-EN')} FOLLOWERS</p>
          ${
            cardData.active
              ? `<button class="button active" id=${cardData.id}>FOLLOWING</button>}`
              : `<button class="button" id=${cardData.id}>FOLLOW</button>`
          }
          
        </div>
      </li>
          `
    )
    .join('');
  cardsContainer.insertAdjacentHTML('afterbegin', markup);
}

const clickItem = function (e) {
  var clickedButton = e.target;
  console.log((e.target.innerHTML = 'FOLLOWING'));

  var followingEl = document.getElementById(e.target.id + 'p');

  // clickedButton.
  var cardOnClick = cardsData[e.target.id - 1];
  if (clickedButton.classList.contains('active')) {
    cardOnClick.active = false;
    e.target.innerHTML = 'FOLLOW';
    cardOnClick.followers = cardOnClick.followers - 1;
  } else {
    cardOnClick.active = true;
    e.target.innerHTML = 'FOLLOWING';
    cardOnClick.followers = cardOnClick.followers + 1;
  }
  clickedButton.classList.toggle('active');
  followingEl.textContent =
    cardOnClick.followers.toLocaleString('en-EN') + ' FOLLOWERS';
  localStorage.setItem('Data', JSON.stringify(cardsData));
};

// Вызов функции при загрузке страницы
window.onload = setData;

var storageData = localStorage.getItem('Data');

function setData() {
  if (storageData) {
    // Преобразование данных в объект JavaScript
    cardsData = JSON.parse(storageData);
    renderCards(cardsData);
    const buttonElAll = document.querySelectorAll('.button');
    console.log(buttonElAll);
    buttonElAll.forEach(function (item) {
      /* Назначаем каждой кнопке обработчик клика */
      item.addEventListener('click', clickItem);
    });

    // Использование объекта
    console.log(cardsData);
  } else {
    console.log('Данные в Local Storage отсутствуют.');
    fetchData();
  }
}
