System.register(['angular2/testing', 'angular2/core', 'angular2/http', 'angular2/http/testing', './store.service', './base.model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, http_1, testing_2, store_service_1, base_model_1;
    var MockStore;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (store_service_1_1) {
                store_service_1 = store_service_1_1;
            },
            function (base_model_1_1) {
                base_model_1 = base_model_1_1;
            }],
        execute: function() {
            MockStore = (function () {
                function MockStore() {
                }
                MockStore.prototype.destroy = function () {
                    return {
                        subscribe: function (cb) {
                            return cb('Response');
                        }
                    };
                };
                MockStore.prototype.create = function () {
                    return {
                        subscribe: function (cb) {
                            return cb({
                                id: 1
                            });
                        }
                    };
                };
                MockStore.prototype.update = function () {
                    return {
                        subscribe: function (cb) {
                            return cb({
                                id: 1
                            });
                        }
                    };
                };
                return MockStore;
            }());
            testing_1.describe('Base Model', function () {
                testing_1.beforeEachProviders(function () { return [core_1.provide(store_service_1.StoreService, { useClass: MockStore }), http_1.HTTP_PROVIDERS, core_1.provide(http_1.XHRBackend, { useClass: testing_2.MockBackend })]; });
                testing_1.it('should delete a user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    var user = new base_model_1.BaseModel({
                        _model: 'user',
                        id: 1
                    }, store);
                    user.destroy().subscribe(function (res) {
                        testing_1.expect(res).toBeDefined();
                    });
                }));
                testing_1.it('should save a new user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    var user = new base_model_1.BaseModel({
                        _model: 'user',
                    }, store);
                    user.save().subscribe(function (user) {
                        testing_1.expect(user.id).toBe(1);
                    });
                }));
                testing_1.it('should save an existing user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    var user = new base_model_1.BaseModel({
                        _model: 'user',
                        id: 1
                    }, store);
                    user.save().subscribe(function (user) {
                        testing_1.expect(user.id).toBe(1);
                    });
                }));
            });
        }
    }
});
//# sourceMappingURL=base.model.spec.js.map