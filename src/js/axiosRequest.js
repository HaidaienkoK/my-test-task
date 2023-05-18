import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';

export default class AxiosRequest {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits= 1;
  }

  fetchElement() {
    return axios
      .get(API_URL, {
        params: {
          key: '25733108-a2320bdb0f7933c9befe0040d',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'orientation',
          safesearch: 'true',
          per_page: 40,
          page: this.page,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response)
      .then(data => {
        this.page += 1;
        this.totalHits = data.data.totalHits;
        return data.data.hits;
      })
      .catch(error => error);
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
