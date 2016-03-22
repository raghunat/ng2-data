import {StoreService} from "./store.service";
import {IActivator} from "./interfaces";


export class AbstractModel {
  _model: string;
  _storeService: StoreService;

  id: number;

  constructor (data: any) {
    if ('id' in data) {
      console.warn('ID found in data');
    }

    Object.assign(this, data);
  }

  save () {}
  
  destroy () {
    
  }

  toJSON (): Object {
    let data: Object = {};
    Object.assign(data, this);

    // Let's prune transient information
    let transientProperties = ['_model', '_storeService'];
    transientProperties.forEach(function (property) {
      delete data[property];
    });

    return data;
  }

  public static create (data: any): AbstractModel {
    return null;
  }
}