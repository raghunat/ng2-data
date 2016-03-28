import {Injectable, Injector} from 'angular2/core';
import {Http, URLSearchParams, BaseRequestOptions, RequestOptions, Headers} from 'angular2/http';
import 'rxjs/Rx';

import {StoreConfig} from './store.config';
import {BaseModel} from './base.model';
import {AbstractModel} from "./types";
import {Observable} from "rxjs/Observable";
import {IActivator} from "./interfaces";

let instance = null;

@Injectable()
export class StoreService {
    public static config: StoreConfig
    public static customGenerateOptions: Function;

    constructor(private http: Http) { }

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
            options.headers = newHeaders
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
        return `${StoreService.config.baseUri}/${this.simplePluralize(model)}`
    }

    makeRequest(method: string, uri: string, params: Object, body: Object = null) {

        // build query string
        let queryParams = new URLSearchParams();
        Object.keys(params).forEach(k => {
            queryParams.set(k, params[k])
        });

        // Create request options
        let options: RequestOptions = this.generateRequestOptions(uri, method, params, body);

        // Add query string
        options.search = queryParams;

        // Switch api based on method
        switch (method) {
            case 'get':
            case 'delete':
                return this.http[method](uri, options);
            default:
                return this.http[method](uri, JSON.stringify(body), options);
        }
    }

    rawRequest(method: string, route: string, params: Object, body: Object) {
        return this.http[method](`${StoreService.config.baseUri}/${route}`, params, body);
    }

    /**
     * GET /model
     */
    _find(model: string, params: Object = {}) {
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
    _findOne(model: string, id: number, params: Object = {}) {
        return this.makeRequest('get', `${this.buildUri(model)}/${id}`, params)
            .map(r => r.json()[model])
            .map(this.modelize(model));
    }

    /**
     * POST /model
     */
    _create(model: string, body: Object, params: Object = {}) {
        let data = {};
        data[model] = body;
        return this.makeRequest('post', this.buildUri(model), params, data)
            .map(r => r.json()[model])
            .map(this.modelize(model));
    }

    /**
     * PUT /model/:id
     */
    update(model: string, id: number, body: Object, params: Object = {}) {
        let data = {};
        data[model] = body;
        return this.makeRequest('put', `${this.buildUri(model)}/${id}`, params, data)
            .map(r => r.json()[model])
            .map(this.modelize(model));
    }

    /**
     * DELETE /model/:id
     */
    destroy(model: string, id: number, body: Object = null, params = {}) {
        return this.makeRequest('delete', `${this.buildUri(model)}/${id}`, params, body).map(r => r.json());
    }

    //======================================================
    /**
     *
     * @param model
     */
    find<T extends AbstractModel>(modelType: IActivator<T>, params: Object = {}): Observable<T[]> {
        let model: string = modelType['_model'];

        return this.makeRequest('get', this.buildUri(model), params)
            .map(r => r.json()[this.simplePluralize(model)])
            .map((array) => {
                return array.map(one => new modelType(one));
            });
    }

    findOne<T extends AbstractModel>(modelType: IActivator<T>, id: number, params: Object = {}): Observable<T> {
        let model: string = modelType['_model'];

        return this.makeRequest('get', `${this.buildUri(model)}/${id}`, params)
            .map(r => r.json())
            .map(json => {
                let data = json[model];

                // Get the list of relationships to load
                let instance = new modelType(data);
                let params = {};
                let prototype = modelType.prototype;
                let relationships = [];

                if ('_hasOne' in prototype && prototype['_hasOne']) {
                    Object.keys(prototype['_hasOne']).forEach(function(propertyName) {
                        params[propertyName] = data[propertyName];

                        relationships.push(prototype['_hasOne'][propertyName]);
                    });
                }

                if ('_hasMany' in prototype && prototype['_hasMany']) {
                    Object.keys(prototype['_hasMany']).forEach(function(propertyName) {
                        params[propertyName] = data[propertyName];

                        relationships.push(prototype['_hasMany'][propertyName]);
                    });
                }

                console.debug('Relationships and Parameters for relationships', relationships, params);
                relationships.forEach((relationship) => {
                    debugger;

                    let relatedModel = relationship.model;
                    let relatedModelType = relationship.modelType;

                    let plural = this.simplePluralize(relatedModel);
                    let relatedID = params[relationship.propertyName];
                    let relatedData;
                    let relatedInstance;

                    if (plural in data) {
                        relatedData = data[plural].find(function(item) { return item.id === relatedID; })
                        relatedInstance = new relatedModelType(relatedData);

                        instance[relationship.propertyName] = relatedInstance;
                        // relationship.restore(instance, data);
                    }

                    relationship.load(this, params);
                });

                return instance;
            });
    }

    create<T extends AbstractModel>(modelInstance: T, params: Object = {}): Observable<T> {
        let modelType = modelInstance.constructor;
        let model: string = modelType['_model'];

        let data = {};
        data[model] = modelInstance.toJSON();
        return this.makeRequest('post', this.buildUri(model), params, data)
            .map(r => r.json()[model])
            .map(one => {
                if (!('id' in one)) {
                    throw new Error('Expected ID missing');
                }

                modelInstance.id = one['id'];
                return modelInstance;
            });
    }
}

