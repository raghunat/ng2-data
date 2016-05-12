System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StoreConfig;
    return {
        setters:[],
        execute: function() {
            /**
             * Input Class
             */
            StoreConfig = (function () {
                function StoreConfig(config) {
                    if (config === void 0) { config = {}; }
                    config = config || {};
                    // TODO
                    // Sanitze inputs
                    // bulk assign
                    Object.assign(this, config);
                }
                return StoreConfig;
            }());
            exports_1("StoreConfig", StoreConfig);
        }
    }
});
//# sourceMappingURL=store.config.js.map