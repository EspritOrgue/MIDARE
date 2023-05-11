import Vue from "vue";
import axios from 'axios';
import { MILID } from "@/models";

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abcd'
  }
};

class ModuleService {
  private _store: any;
  private _baseUrl = process.env.BASE_URL;


  get store() {
    return this._store;
  }

  get modules(){
    return this._store.modules;
  }

  get definitions(){
    return this._store.definitions;
  }

  getModuleWithId(id){
    return this._store.modules.find(m => m.id === id.toString());
  }

  getModuleCount() {
    return this._store.modules.length;
  }

  getLessonsForModuleWithId(id){
    const module = this.getModuleWithId(id);
    if(!module) return [];

    return module.lessons;
  }

  getLessonForModuleAndLessonId(moduleId, lessonId){
    const lessons = this.getLessonsForModuleWithId(moduleId);
    return lessons.find(l => l.id === lessonId.toString());
  }
  
  getLessonForModuleAndLessonIndex(moduleId, lessonIndex){
    const lessons = this.getLessonsForModuleWithId(moduleId);
    return lessons.find(l => l.index === lessonIndex);
  }

  async getAll(){
    if(!this._store) {
      const res = await axios.get(this._baseUrl + 'data.json',defaultAxios);
      this._store = res.data;
    }
    return this._store;
  }

}

//
// service start with $
export const $module = new ModuleService();