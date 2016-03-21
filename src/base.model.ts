import {StoreService} from './store.service';

export class BaseModel {
  public id:any
  public _model:string

  constructor(params:Object = {}, private store: StoreService) {
    Object.assign(this, params);
  }

  stripForRequest() {
    let obj = {};

    Object.keys(this).forEach(k => {
      switch(k) {
        case '_model':
        case 'store':
          return;
        default:
          obj[k] = this[k];
          return;
      }
    });

    return obj;
  }

  save() {
    if (this.id !== undefined) {
      return this.store.update(this._model, this.id, this.stripForRequest());
    } else {
      return this.store._create(this._model, this.stripForRequest());
    }
  }

  destroy() {
    return this.store.destroy(this._model, this.id);
  }
}
