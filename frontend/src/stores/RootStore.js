import { makeAutoObservable } from 'mobx';
import MovieStore from './MovieStore';

class RootStore {
  movieStore;

  constructor() {
    makeAutoObservable(this);
    this.movieStore = new MovieStore(this);
  }
}

const rootStore = new RootStore();
export default rootStore;