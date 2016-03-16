import {Injectable, Injector} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/Rx';

import {StoreConfig} from './store.config';
import {BaseModel} from './base.model';

let instance = null;

@Injectable()
export class StoreService {
  public static config: StoreConfig

  constructor(private http: Http) {}

  init(config: StoreConfig) {
    StoreService.config = config;
  }

  simplePluralize(noun: string) {
    switch (noun[noun.length - 1]) {
      case 's':
        return noun + 'es';
      case 'y':
        switch (noun[noun.length - 2]) {
          case 'a':
          case 'e':
          case 'i':
          case 'o':
          case 'u':
            return noun + 's';
          default:
            return noun.substring(0, noun.length - 2) + 'ies';
        }
      default:
        return noun + 's';
    }
  }

  modelize(model: string) {
    return m => {
      m._model = model;
      return new BaseModel(m, this);
    }
  }

  buildUri(model: string) {
    return `${StoreService.config.baseUri}/${this.simplePluralize(model) }`
  }

  makeRequest(method: string, uri: string, params: Object) {
    return this.http[method](uri, params);
  }

  rawRequest(method: string, route: string, params: Object, body:Object) {
    return this.http[method](`${StoreService.config.baseUri}/${route}`, params, body);
  }

  /**
   * GET /model
   */
  find(model: string, params: Object = {}) {
    return this.makeRequest('get', this.buildUri(model), params).map(r => r.json()[this.simplePluralize(model)]).map((array) => {
      let results = [];
      array.forEach(i => {
        results.push(new BaseModel(i, this));
      });
      return results;
    });
  }

  /**
   * GET /model/:id
   */
  findOne(model: string, id: number) {
    return this.http.get(`${this.buildUri(model) }/${id}`).map(r => r.json()[model]).map(this.modelize(model));
  }

  /**
   * POST /model
   */
  create(model: string, body: Object) {
    let data = {};
    data[model] = body;
    return this.http.post(this.buildUri(model), JSON.stringify(data)).map(r => r.json()[model]).map(this.modelize(model));
  }

  /**
   * PUT /model/:id
   */
  update(model: string, id: number, body: Object) {
    let data = {};
    data[model] = body;
    return this.http.put(`${this.buildUri(model) }/${id}`, JSON.stringify(data)).map(r => r.json()[model]).map(this.modelize(model));
  }

  /**
   * DELETE /model/:id
   */
  destroy(model: string, id: number) {
    return this.http.delete(`${this.buildUri(model) }/${id}`).map(r => r.json());
  }
}
