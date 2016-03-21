import {StoreService, IActivator} from "./store.service";

export class AbstractModel implements IActivator<AbstractModel> {
  _model: string;
  _storeService: StoreService;

  id: number;

  constructor (data: any) {
    Object.assign(this, data);
  }

  save () {}
  
  destroy () {
    
  }

  public static create (data: any): AbstractModel {
    return null;
  }
}