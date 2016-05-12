System.register(['@angular/core/testing', './store.config'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, store_config_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (store_config_1_1) {
                store_config_1 = store_config_1_1;
            }],
        execute: function() {
            testing_1.describe('StoreConfig', function () {
                testing_1.it('should be a basic config class', testing_1.inject([], function () {
                    testing_1.expect(store_config_1.StoreConfig).toBeDefined();
                    var config = new store_config_1.StoreConfig({ baseUri: 'someuri' });
                    testing_1.expect(config.baseUri).toBe('someuri');
                }));
            });
        }
    }
});
//# sourceMappingURL=store.config.spec.js.map