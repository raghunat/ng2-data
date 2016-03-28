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

abstract class Relationship<T extends AbstractModel> {
  constructor(
    public propertyKey: string,
    public modelType: IActivator<T>) {
  };
  abstract load (store: StoreService, params: Object): Promise<any>;
  abstract restore (ownerInstance: AbstractModel, data: Object, params: Object): void;
}

export enum PropertyTypes {
  Value,
  HasOne,
  HasMany
}

export class OneToOneRelationship<T extends AbstractModel> extends Relationship<T> {
  /**
   *
   * @param store
   * @param params {Object} Should looks like this:
   * {
   *     team: 1
   *     reports_to: 40
   * }
   * There should be one singe params object for multiple relationships, each of which
   * shall pick the correct property to load. The service should then receive the loaded elements,
   * cache them, an assign to the appropriate key of the model instance.
   *
   * @return {Promise<T>}
   */
  load (store: StoreService, params: Object): Promise<T> {
    let id = params[this.propertyKey];
    return store.findOne(this.modelType, id).toPromise();
  }

  restore (ownerInstance: AbstractModel, data: Object, params: Object): void {

  }
}

export class OneToManyRelationship<T extends AbstractModel> extends Relationship<T> {
  load (store: StoreService, params: Object): Promise<T[]> {
    return Promise.resolve([]);
  }

  restore (ownerInstance: AbstractModel, data: Object, params: Object): void {

  }
}