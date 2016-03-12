import {
it,
iit,
describe,
ddescribe,
expect,
inject,
injectAsync,
TestComponentBuilder,
beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS, XHRBackend} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';

import {StoreService} from './store.service';
import {BaseModel} from './base.model';

class MockStore {
  destroy() {
    return {
      subscribe: function(cb) {
        return cb('Response');
      }
    }
  }
  create() {
    return {
      subscribe: function(cb) {
        return cb({
          id: 1
        })
      }
    }
  }
  update() {
    return {
      subscribe: function(cb) {
        return cb({
          id: 1
        })
      }
    }
  }
}

describe('Base Model', () => {

  beforeEachProviders(() => [provide(StoreService, { useClass: MockStore }), HTTP_PROVIDERS, provide(XHRBackend, { useClass: MockBackend })]);

  it('should delete a user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
    let user = new BaseModel({
      _model: 'user',
      id: 1
    }, store);

    user.destroy().subscribe(res => {
      expect(res).toBeDefined();
    });
  }));

  it('should save a new user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
    let user = new BaseModel({
      _model: 'user',
    }, store);

    user.save().subscribe(user => {
      expect(user.id).toBe(1);
    });
  }));

  it('should save an existing user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
    let user = new BaseModel({
      _model: 'user',
      id:1
    }, store);

    user.save().subscribe(user => {
      expect(user.id).toBe(1);
    });
  }));

});
