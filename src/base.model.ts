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
      return this.store.create(this._model, this.stripForRequest());
    }
  }

  destroy() {
    return this.store.destroy(this._model, this.id);
  }


}

