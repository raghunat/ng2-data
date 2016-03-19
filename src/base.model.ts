import {StoreService} from './store.service';

export class BaseModel {

  public id: any;
  public _model: string;

  /**
Definition of statically defined method
**/
  public static define(model: string, defObject: Object = {}) {
    StoreService.registedModel.push({ name: model, defObject: defObject });
  }


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


}

