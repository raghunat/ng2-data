System.register(['angular2/core', 'angular2/http', 'rxjs/Rx', './base.model'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, base_model_1;
    var instance, StoreService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (base_model_1_1) {
                base_model_1 = base_model_1_1;
            }],
        execute: function() {
            instance = null;
            StoreService = (function () {
                function StoreService(http) {
                    this.http = http;
                }
                StoreService.prototype.init = function (config) {
                    StoreService.config = config;
                };
                StoreService.prototype.log = function (msg, data) {
                    if (window['NG2_DATA_LOG']) {
                        console.log('[ng2-data]', msg, data);
                    }
                };
                StoreService.prototype.generateRequestOptions = function (url, method, queryParameters, body) {
                    this.log('Generating headers with', arguments);
                    var options = new http_1.RequestOptions();
                    if (StoreService.customGenerateOptions) {
                        var createdHeaders = StoreService.customGenerateOptions(url, method, queryParameters, body);
                        var newHeaders = new http_1.Headers();
                        Object.keys(createdHeaders).forEach(function (k) {
                            newHeaders.set(k, createdHeaders[k]);
                        });
                        options.headers = newHeaders;
                    }
                    this.log('Generated The Following headers', options);
                    return options;
                };
                StoreService.prototype.generateRequestQuery = function (url, method, queryParameters, body) {
                    this.log('Generating query parameters with', arguments);
                    var query = {};
                    if (StoreService.customGenerateQuery) {
                        Object.assign(query, StoreService.customGenerateQuery(url, method, queryParameters, body));
                    }
                    else {
                        Object.assign(query, queryParameters);
                    }
                    this.log('Generated The following query parameters', query);
                    return query;
                };
                StoreService.prototype.extendHeaders = function (fn) {
                    StoreService.customGenerateOptions = fn;
                };
                StoreService.prototype.extendQueryParameters = function (fn) {
                    StoreService.customGenerateQuery = fn;
                };
                StoreService.prototype.simplePluralize = function (noun) {
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
                };
                StoreService.prototype.modelize = function (model) {
                    var _this = this;
                    return function (m) {
                        m._model = model;
                        return new base_model_1.BaseModel(m, _this);
                    };
                };
                StoreService.prototype.buildUri = function (model) {
                    return StoreService.config.baseUri + "/" + this.simplePluralize(model);
                };
                StoreService.prototype.makeRequest = function (method, uri, params, body) {
                    var _this = this;
                    if (body === void 0) { body = null; }
                    // build query string
                    var queryParams = new http_1.URLSearchParams();
                    // build query
                    params = this.generateRequestQuery(uri, method, params, body);
                    // url-ify
                    Object.keys(params).forEach(function (k) {
                        _this.log(k, {});
                        if (params[k] !== undefined) {
                            queryParams.set(k, (typeof params[k] !== 'string' ? JSON.stringify(params[k]) : params[k]).replace(/\{/g, '%7B').replace(/\}/g, '%7D'));
                        }
                    });
                    // Create request options
                    var options = this.generateRequestOptions(uri, method, params, body);
                    // Add query string
                    options.search = queryParams;
                    this.log('Performing request with the following options', options);
                    // Switch api based on method
                    switch (method) {
                        case 'get':
                        case 'delete':
                            return this.http[method](uri, options);
                        default:
                            return this.http[method](uri, JSON.stringify(body), options);
                    }
                };
                StoreService.prototype.rawRequest = function (method, route, params, body) {
                    return this.http[method](StoreService.config.baseUri + "/" + route, params, body);
                };
                /**
                 * GET /model
                 */
                StoreService.prototype.find = function (model, params) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    return this.makeRequest('get', this.buildUri(model), params).map(function (r) { return r.json()[_this.simplePluralize(model)]; }).map(function (array) {
                        var results = [];
                        array.forEach(function (i) {
                            i._model = model;
                            results.push(new base_model_1.BaseModel(i, _this));
                        });
                        return results;
                    });
                };
                /**
                 * GET /model/:id
                 */
                StoreService.prototype.findOne = function (model, id, params) {
                    if (params === void 0) { params = {}; }
                    return this.makeRequest('get', this.buildUri(model) + "/" + id, params).map(function (r) { return r.json()[model]; }).map(this.modelize(model));
                };
                /**
                 * POST /model
                 */
                StoreService.prototype.create = function (model, body, params) {
                    if (params === void 0) { params = {}; }
                    var data = {};
                    data[model] = body;
                    return this.makeRequest('post', this.buildUri(model), params, data).map(function (r) { return r.json()[model]; }).map(this.modelize(model));
                };
                /**
                 * PUT /model/:id
                 */
                StoreService.prototype.update = function (model, id, body, params) {
                    if (params === void 0) { params = {}; }
                    var data = {};
                    data[model] = body;
                    return this.makeRequest('put', this.buildUri(model) + "/" + id, params, data).map(function (r) { return r.json()[model]; }).map(this.modelize(model));
                };
                /**
                 * DELETE /model/:id
                 */
                StoreService.prototype.destroy = function (model, id, body, params) {
                    if (body === void 0) { body = null; }
                    if (params === void 0) { params = {}; }
                    return this.makeRequest('delete', this.buildUri(model) + "/" + id, params, body).map(function (r) { return r.json(); });
                };
                StoreService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], StoreService);
                return StoreService;
            })();
            exports_1("StoreService", StoreService);
        }
    }
});
//# sourceMappingURL=store.service.js.map