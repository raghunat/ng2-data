System.register(['@angular/core/testing', '@angular/core', './store.service', './store.config', '@angular/http', '@angular/http/testing'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, store_service_1, store_config_1, http_1, testing_2, http_2;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (store_service_1_1) {
                store_service_1 = store_service_1_1;
            },
            function (store_config_1_1) {
                store_config_1 = store_config_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
                http_2 = http_1_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            }],
        execute: function() {
            testing_1.describe('StoreService Service', function () {
                testing_1.beforeEachProviders(function () { return [store_service_1.StoreService, http_1.HTTP_PROVIDERS, core_1.provide(http_1.XHRBackend, { useClass: testing_2.MockBackend })]; });
                testing_1.it('should find users', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    // prep
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_2.ResponseOptions({
                            body: {
                                users: [{
                                        id: 1,
                                        name: 'stephen'
                                    }]
                            }
                        })));
                    });
                    // test
                    store.init(new store_config_1.StoreConfig({ baseUri: 'http://localhost' }));
                    store.find('user').subscribe(function (users) {
                        testing_1.expect(users[0].id).toBe(1);
                        testing_1.expect(users[0].name).toBe('stephen');
                    });
                }));
                testing_1.it('should find a specific user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    // prep
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_2.ResponseOptions({
                            body: {
                                user: {
                                    id: 1,
                                    name: 'stephen'
                                }
                            }
                        })));
                    });
                    // test
                    store.init(new store_config_1.StoreConfig({ baseUri: 'http://localhost' }));
                    store.findOne('user', 1).subscribe(function (user) {
                        testing_1.expect(user.id).toBe(1);
                        testing_1.expect(user.name).toBe('stephen');
                    });
                }));
                testing_1.it('should create a user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    // prep
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_2.ResponseOptions({
                            body: {
                                user: {
                                    id: 1,
                                    name: 'stephen'
                                }
                            }
                        })));
                    });
                    // test
                    store.init(new store_config_1.StoreConfig({ baseUri: 'http://localhost' }));
                    store.create('user', { name: 'stephen' }).subscribe(function (user) {
                        testing_1.expect(user.id).toBe(1);
                        testing_1.expect(user.name).toBe('stephen');
                    });
                }));
                testing_1.it('should update a user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    // prep
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_2.ResponseOptions({
                            body: {
                                user: {
                                    id: 1,
                                    name: 'stephenA'
                                }
                            }
                        })));
                    });
                    // test
                    store.init(new store_config_1.StoreConfig({ baseUri: 'http://localhost' }));
                    store.update('user', 1, { name: 'stephen' }).subscribe(function (user) {
                        testing_1.expect(user.id).toBe(1);
                        testing_1.expect(user.name).toBe('stephenA');
                    });
                }));
                testing_1.it('should destroy a user', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    // prep
                    mockBackend.connections.subscribe(function (connection) {
                        connection.mockRespond(new http_1.Response(new http_2.ResponseOptions({
                            body: {
                                statusCode: 200
                            }
                        })));
                    });
                    // test
                    store.init(new store_config_1.StoreConfig({ baseUri: 'http://localhost' }));
                    store.destroy('user', 1).subscribe(function (res) {
                        testing_1.expect(res.statusCode).toBe(200);
                    });
                }));
                testing_1.it('can pluralize nouns', testing_1.inject([http_1.XHRBackend, store_service_1.StoreService], function (mockBackend, store) {
                    var dictionary = {
                        'product': 'products',
                        'sequence': 'sequences',
                        'repo': 'repos',
                        'testsuite': 'testsuites',
                        'bug': 'bugs',
                        'company': 'companies',
                        'fix': 'fixes'
                    };
                    var singulars = Object.keys(dictionary);
                    var expected = Object.keys(dictionary).map(function (key) { return dictionary[key]; });
                    var actuals = singulars.map(store.simplePluralize);
                    testing_1.expect(expected).toEqual(actuals);
                }));
            });
        }
    }
});
//# sourceMappingURL=store.service.spec.js.map