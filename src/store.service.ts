import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, RequestOptions, Headers} from 'angular2/http';
import 'rxjs/Rx';

import {StoreConfig} from './store.config';
import {BaseModel} from './base.model';


@Injectable()
export class StoreService {
  public static config: StoreConfig;
  public static customGenerateOptions: Function;
  public static registedModel: Object[];



  constructor(private http: Http) {}

  init(config: StoreConfig) {
    StoreService.config = config;

  }
  generateRequestOptions(url, method, queryParameters, body) {
    if (StoreService.customGenerateOptions) {
      let options = new RequestOptions();
      let createdHeaders = StoreService.customGenerateOptions(url, method, queryParameters, body);
      let newHeaders = new Headers();
      Object.keys(createdHeaders).forEach(k => {
        newHeaders.set(k, createdHeaders[k]);
      });
      options.headers = newHeaders;
      return options;
    } else {
      return new RequestOptions();
    }
  }

  extendHeaders(fn: Function) {
    StoreService.customGenerateOptions = fn;
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

  modelize(model: Object) {
    return m => {
      m._model = model.name;
      return new BaseModel(m, this);
    };
  }

  buildUri(model: string) {
    return `${StoreService.config.baseUri}/${this.simplePluralize(model)}`;
  }

  makeRequest(method: string, uri: string, params: Object, body:Object = null) {

    // build query string
    let queryParams = new URLSearchParams();
    Object.keys(params).forEach(k => {
      queryParams.set(k, params[k]);
    });

    // Create request options
    let options:RequestOptions = this.generateRequestOptions(uri, method, params, body);

    // Add query string
    options.search = queryParams;

    // Switch api based on method
    switch(method) {
      case 'get':
        return this.http[method](uri, options);
      default:
        return this.http[method](uri, JSON.stringify(body), options);
    }
  }


  rawRequest(method: string, route: string, params: Object, body:Object) {
    return this.http[method](`${StoreService.config.baseUri}/${route}`, params, body);
  }

  validateModel(name:string) {
    return StoreService.registedModel.find(function(value) {
      return value.name === name;
    });
  }

  /**
   * GET /model
   */
  find(model: string, params: Object = {}) {
    let instanceModel = this.validateModel(model);
    if(!instanceModel) throw Error('Invalid Model');
    return this.makeRequest('get', this.buildUri(instanceModel.name), params)
    .map(r => r.json()[this.simplePluralize(model)])
    .map((array) => {
      let results = [];
      array.forEach(i => {
        i._model = model;
        results.push(this.modelize(instanceModel));
      });
      return results;
    });
  }

  /**
   * GET /model/:id
   */
  findOne(model: string, id: number, params: Object = {}) {
    let instanceModel = this.validateModel(model);
    if (!instanceModel) throw Error('invalid Model');
    return this.makeRequest('get', `${this.buildUri(instanceModel.name) }/${id}`, params)
    .map(r => r.json()[instanceModel.name])
     .map(this.modelize(instanceModel));
  }

  /**
   * POST /model
   */
  create(model: string, body: Object, params: Object = {}) {
    let data = {};
    data[model] = body;
    return this.makeRequest('post', this.buildUri(model), params, data).map(r => r.json()[model]).map(this.modelize(model));
  }

  /**
   * PUT /model/:id
   */
  update(model: string, id: number, body: Object, params: Object = {}) {
    let data = {};
    data[model] = body;
    return this.makeRequest('put', `${this.buildUri(model) }/${id}`, params, data).map(r => r.json()[model]).map(this.modelize(model));
  }

  /**
   * DELETE /model/:id
   */
  destroy(model: string, id: number, body:Object = null, params = {}) {
    return this.makeRequest('delete', `${this.buildUri(model) }/${id}`, params, body).map(r => r.json());
  }
}
