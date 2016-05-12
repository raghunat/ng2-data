import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import 'rxjs/Rx';

import {StoreConfig} from './store.config';
import {BaseModel} from './base.model';

let instance = null;

@Injectable()
export class StoreService {
  public static config: StoreConfig
  public static customGenerateOptions: Function;
  public static customGenerateQuery: Function;

  constructor(private http: Http) {}

  init(config: StoreConfig) {
    StoreService.config = config;
  }

  log(msg, data) {
    if (window['NG2_DATA_LOG']) {
      console.log('[ng2-data]', msg, data);
    }
  }

  generateRequestOptions(url, method, queryParameters, body) {
    this.log('Generating headers with', arguments);
    let options = new RequestOptions();
    if (StoreService.customGenerateOptions) {
      let createdHeaders = StoreService.customGenerateOptions(url, method, queryParameters, body);
      let newHeaders = new Headers();
      Object.keys(createdHeaders).forEach(k => {
        newHeaders.set(k, createdHeaders[k]);
      });
      options.headers = newHeaders

    }
    this.log('Generated The Following headers', options);
    return options;
  }

  generateRequestQuery(url, method, queryParameters, body) {
    this.log('Generating query parameters with', arguments);
    let query = {};
    if (StoreService.customGenerateQuery) {
      Object.assign(query, StoreService.customGenerateQuery(url, method, queryParameters, body));
    } else {
      Object.assign(query, queryParameters);
    }
    this.log('Generated The following query parameters', query);
    return query;
  }

  extendHeaders(fn: Function) {
    StoreService.customGenerateOptions = fn;
  }

  extendQueryParameters(fn: Function) {
    StoreService.customGenerateQuery = fn;
  }

  simplePluralize(noun: string) {
    switch (noun[noun.length - 1]) {
      case 's':
      case 'x':
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
            return noun.substring(0, noun.length - 1) + 'ies';
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

  makeRequest(method: string, uri: string, params: Object, body:Object = null) {

    // build query string
    let queryParams = new URLSearchParams();
    // build query
    params = this.generateRequestQuery(uri, method, params, body);
    // url-ify
    Object.keys(params).forEach(k => {
      this.log(k, {});
      if (params[k] !== undefined) {
        queryParams.set(k, (typeof params[k] !== 'string' ? JSON.stringify(params[k]) : params[k]).replace(/\{/g, '%7B').replace(/\}/g, '%7D'));
      }
    });

    // Create request options
    let options:RequestOptions = this.generateRequestOptions(uri, method, params, body);

    // Add query string
    options.search = queryParams;

    this.log('Performing request with the following options', options);

    // Switch api based on method
    switch(method) {
      case 'get':
      case 'delete':
        return this.http[method](uri, options);
      default:
        return this.http[method](uri, JSON.stringify(body), options);
    }
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
        i._model = model;
        results.push(new BaseModel(i, this));
      });
      return results;
    });
  }

  /**
   * GET /model/:id
   */
  findOne(model: string, id: string|number, params: Object = {}) {
    return this.makeRequest('get', `${this.buildUri(model) }/${id}`, params).map(r => r.json()[model]).map(this.modelize(model));
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
  update(model: string, id: string|number, body: Object, params: Object = {}) {
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
