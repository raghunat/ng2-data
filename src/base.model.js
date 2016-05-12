System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BaseModel;
    return {
        setters:[],
        execute: function() {
            BaseModel = (function () {
                function BaseModel(params, store) {
                    if (params === void 0) { params = {}; }
                    this.store = store;
                    Object.assign(this, params);
                }
                BaseModel.prototype.stripForRequest = function () {
                    var _this = this;
                    var obj = {};
                    Object.keys(this).forEach(function (k) {
                        switch (k) {
                            case '_model':
                            case 'store':
                                return;
                            default:
                                obj[k] = _this[k];
                                return;
                        }
                    });
                    return obj;
                };
                BaseModel.prototype.save = function () {
                    if (this.id !== undefined) {
                        return this.store.update(this._model, this.id, this.stripForRequest());
                    }
                    else {
                        return this.store.create(this._model, this.stripForRequest());
                    }
                };
                BaseModel.prototype.destroy = function () {
                    return this.store.destroy(this._model, this.id);
                };
                return BaseModel;
            }());
            exports_1("BaseModel", BaseModel);
        }
    }
});
//# sourceMappingURL=base.model.js.map