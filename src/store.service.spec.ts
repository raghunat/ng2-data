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
import {StoreService} from './store.service';
import {StoreConfig} from './store.config';
import {Headers, HTTP_PROVIDERS, BaseRequestOptions, XHRBackend, Response} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {ResponseOptions} from 'angular2/http';

import {AbstractModel, PropertyTypes} from "./types";
import {Model, HasOne} from "./annotations";

@Model({
    model: 'team'
})
class Team extends AbstractModel {
    name: string
}

@Model({
    model: 'user'
})
class User extends AbstractModel {
    name: string;
    @HasOne({
        type: PropertyTypes.HasOne
    })
    team: Team;
}

describe('StoreService Service', () => {

    beforeEachProviders(() => [StoreService, HTTP_PROVIDERS, provide(XHRBackend, { useClass: MockBackend })]);

    it('should find users', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
        // prep
        mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                    new ResponseOptions({
                        body: {
                            users: [{
                                id: 1,
                                name: 'stephen',
                                team: 30
                            }],
                            teams: [
                                {
                                    id: 30,
                                    name: 'CI Team'
                                }
                            ]
                        }
                    })));
            });

        // test
        store.init(new StoreConfig({ baseUri: 'http://localhost' }));
        store.find(User).subscribe(users => {
            expect(users[0] instanceof User).toBe(true);

            expect(users[0].id).toBe(1);
            expect(users[0]['name']).toBe('stephen');
        });
    }));

    it('should find a specific user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
        // prep
        mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                    new ResponseOptions({
                        body: {
                            user: {
                                id: 1,
                                name: 'stephen',
                                team: 30
                            },
                            teams: [
                                {
                                    id: 30,
                                    name: 'CI Team'
                                }
                            ]
                        }
                    })));
            });

        // test
        store.init(new StoreConfig({ baseUri: 'http://localhost' }));
        store.findOne(User, 1).subscribe(user => {
            expect(user instanceof User).toBe(true);

            expect(user.id).toBe(1);
            expect(user['name']).toBe('stephen');
        });
    }));

    it('should create a user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
        // prep
        mockBackend.connections.subscribe(
            (connection: MockConnection) => {
                connection.mockRespond(new Response(
                    new ResponseOptions({
                        body: {
                            user: {
                                id: 1,
                                name: 'stephen'
                            }
                        }
                    })));
            });

        // test
        store.init(new StoreConfig({ baseUri: 'http://localhost' }));

        let newUser = new User({ name: 'stephen' });
        store.create(newUser).subscribe(user => {
            expect(user instanceof User).toBe(true);

            expect(newUser).toBe(user);
            expect(user['id']).toBe(1);
            expect(user['name']).toBe('stephen');
        });
    }));
    /***
     it('should update a user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
      // prep
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                user: {
                  id: 1,
                  name: 'stephenA'
                }
              }
            })));
        });
  
      // test
      store.init(new StoreConfig({ baseUri: 'http://localhost' }));
      store.update('user', 1, { name: 'stephen' }).subscribe(user => {
        expect(user.id).toBe(1);
        expect(user.name).toBe('stephenA');
      });
    }));
  
     it('should destroy a user', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
      // prep
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                statusCode: 200
              }
            })));
        });
  
      // test
      store.init(new StoreConfig({ baseUri: 'http://localhost' }));
      store.destroy('user', 1).subscribe(res => {
        expect(res.statusCode).toBe(200);
      });
    }));
  
     it('can pluralize nouns', inject([XHRBackend, StoreService], (mockBackend: MockBackend, store: StoreService) => {
      let dictionary = {
        'product': 'products',
        'sequence': 'sequences',
        'repo': 'repos',
        'testsuite': 'testsuites',
        'bug': 'bugs',
        'company': 'companies',
        'fix': 'fixes'
      };
  
      let singulars = Object.keys(dictionary);
      let expected = Object.keys(dictionary).map(key => dictionary[key]);
  
      let actuals = singulars.map(store.simplePluralize);
      expect(expected).toEqual(actuals);
    }));
     */
});
