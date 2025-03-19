import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

class MovieStore {
  rootStore;
  moviesPerActor = {};
  actorsWithMultipleCharacters = {};
  charactersWithMultipleActors = {};
  loading = false;
  error = null;
  activeTab = 'moviesPerActor';

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setActiveTab(tab) {
    this.activeTab = tab;
  }

  async fetchMoviesPerActor() {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get('http://localhost:3000/api/moviesPerActor');
      runInAction(() => {
        this.moviesPerActor = response.data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async fetchActorsWithMultipleCharacters() {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get('http://localhost:3000/api/actorsWithMultipleCharacters');
      runInAction(() => {
        this.actorsWithMultipleCharacters = response.data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async fetchCharactersWithMultipleActors() {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get('http://localhost:3000/api/charactersWithMultipleActors');
      runInAction(() => {
        this.charactersWithMultipleActors = response.data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }
}

export default MovieStore;