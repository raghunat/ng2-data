import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from 'angular2/testing';

import {StoreConfig} from './store.config';

describe('StoreConfig', () => {

  it('should be a basic config class', inject([], () => {
    expect(StoreConfig).toBeDefined();
    let config = new StoreConfig({baseUri:'someuri'});
    expect(config.baseUri).toBe('someuri');
  }));

});
