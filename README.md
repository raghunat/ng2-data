# NOT READY!
## ng2-data
Conventional HTTP client for Model Data in Angular 2

## Examples
### Making Models
```javascript
// user.model.ts
import {Model, Type} from 'ng2-data';

exports Model.define('student', {
  name: Type.string,
  age: Type.number,
  // classes: Type.has.many('courses'),
  // school: Type.has.one('school'),
  // nameAndAge: function (student) {
  //   return student.name + student.age;
  // }
});
```

### Loading Store
```javascript
import {StoreService, StoreConfig} from 'ng2-data';

export class AppComponent {
  constructor(store: StoreService) {
    store.init(new StoreConfig({baseUri: 'http://localhost:3003/api'}));
  }
}
```


### Using the store
```javascript
import {StoreService} from 'ng2-data';

export class MyComponent {
  constructor(store: StoreService) {
    // GET /users
    store.find('users').subscribe(/*...*/);

    // GET /courses?key=value
    store.find('courses', {/*query filter*/}).subscribe(/*...*/); // returns [user objects]

    // GET /users/1
    store.findOne('user', 1).subscribe(/*...*/); // returns user object

    // POST /users
    store.create('user', {name:'bob'}).subscribe(/*...*/);
    // OR
    let bob = store.instance('user');
    bob.name = 'bob';
    //then
    bob.save().subscribe(/*...*/);

    // PUT /users/1
    store.update('schools', 1, {/*with*/}).subscribe(/*...*/); // returns user object

    // DELETE /users/1
    store.destroy('schools', 1).subscribe(/*...*/); // Returns OK
  }
}
```
