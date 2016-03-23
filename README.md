# NOT READY! THE BELOW EXAMPLES ARE FOR END USE REFERENCE
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
  classes: Type.has.many('courses'),
  school: Type.has.one('school'),
  nameAndAge: function (student) {
    return student.name + student.age;
  }
});
```

Or with annotation

```typescript
import {Model, Type} from 'ng2-data';

abstract class Relationship {
  query: Function; // executable
  
}

class HasMany<T> {
  models: T[];

  construct(model: T) {
  }
}

class HasOne<T> {
  model: T;
  
  construct(model: T) {
  }
}


@Model({
  name: 'student'
})
class Student {
  name: string;
  age: number;
  
  classes: Type.has.many(Course);
  school: Type.has.one(School);
  contact: Type.embed(Contact);
}

@Model({
  name: 'course'
})
class Course {
}

@Model({
  name: 'school'
})
class School {
}
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

OR with TypeScript

```typescript
import {StoreService} from 'ng2-data';
// given an instance of StoreService variable called store

// GET /students?param1=value1
store.find(User, { param1: value1 }).subscribe(/*...*/);

// GET /students/1
store.findOne(User, 1).subscribe(/*...*/);

// GET /students/1?includes=courses,school
store.findOne(User, 1).include(User.courses, User.school).subscribe(/*...*/);

// POST /students
let school = aSchoolThatIhaveRetrievedSomewhere;
let student = new Student();
student.school = school;

store.create(student).subscribe(/*...*/);
// OR
student.save().subscribe(/*...*/);

// PUT /students/1
let student = aStudentThatIknew;

student.age = 30;
store.update(student).subscribe(/*...*/);
// OR
student.save().subscribe(/*...*/);

// DELETE /users/1
let student = aStudentThatIknew;

store.destroy('schools', 1).subscribe(/*...*/); // Returns OK
// OR
student.destroy().subscribe(/*...*/);
```
