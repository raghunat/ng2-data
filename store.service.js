System.register(['angular2/core', 'angular2/http', 'rxjs/Rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var StoreService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            StoreService = (function () {
                function StoreService(http) {
                    this.http = http;
                    if (StoreService.instance) {
                        return StoreService.instance;
                    }
                    else {
                        StoreService.instance = this;
                    }
                }
                StoreService.prototype.init = function (options) {
                    this.config = options;
                };
                StoreService.prototype.simplePluralize = function (noun) {
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
                };
                StoreService.prototype.buildUri = function (model) {
                    return this.config.baseUri + "/" + this.simplePluralize(model);
                };
                StoreService.prototype.makeRequest = function (method, uri, params) {
                    return this.http[method](uri, params);
                };
                /**
                 * GET /model
                 */
                StoreService.prototype.find = function (model, params) {
                    if (params === void 0) { params = {}; }
                    // let modelContainer = this.config.models.find(m => m.name === model);
                    return this.makeRequest('get', this.buildUri(model), params).map(function (r) {
                        var response = r.json();
                        var result = [];
                        // response[this.simplePluralize(modelContainer.name)].forEach(i => {
                        //   let item = new modelContainer.Model();
                        //   Object.assign(item, i);
                        //   result.push(item);
                        // });
                        return result;
                    });
                };
                /**
                 * GET /model/:id
                 */
                StoreService.prototype.findOne = function (model, id) {
                    return this.http.get(this.buildUri(model) + "/" + id).map(function (r) { return r.json(); });
                };
                /**
                 * POST /model
                 */
                StoreService.prototype.create = function (model, params) {
                    return this.http.post(this.buildUri(model), JSON.stringify(params)).map(function (r) { return r.json(); });
                };
                /**
                 * PUT /model
                 */
                StoreService.prototype.update = function (model, params) {
                    return this.http.put(this.buildUri(model), JSON.stringify(params)).map(function (r) { return r.json(); });
                };
                /**
                 * DELETE /model/:id
                 */
                StoreService.prototype.destroy = function (model, id) {
                    return this.http.delete(this.buildUri(model) + "/" + id).map(function (r) { return r.json(); });
                };
                StoreService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], StoreService);
                return StoreService;
            }());
            exports_1("StoreService", StoreService);
        }
    }
});
//# sourceMappingURL=store.service.js.map