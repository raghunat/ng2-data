import {StoreService} from './store.service';

export class BaseModel {
  public static define: Function;
  public id:any;
  public _model:string;


  constructor(params:Object = {}, private store: StoreService) {
    Object.assign(this, params);
  }

  save() {
    if (this.id !== undefined) {
      return this.store.update(this._model, this.id, this);
    } else {
      return this.store.create(this._model, this);
    }
  }

  destroy() {
    return this.store.destroy(this._model, this.id);
  }
/**
Definition of statically defined method
**/
   define(model: string, params: Object = {}) {
     return this.store.find(model, params);
  }
}

