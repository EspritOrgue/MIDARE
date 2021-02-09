import Vue from "vue";
import axios from 'axios';

class ModuleService {
  private _store: any;

  constructor() {
    this._store = Vue.observable({
      modules: {}
    });
  }

  get store() {
    return this._store;
  }


  async getAll(): Promise<MILID.Module[]> {
    if(!this._store.modules.length) {
      const res = await axios.get('/modules.json');
      this._store.modules = res.data;
    }
    return this._store.modules;
  }

}

//
// service start with $
export const $module = new ModuleService();