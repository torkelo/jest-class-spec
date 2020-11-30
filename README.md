[![npm package](https://img.shields.io/npm/v/jest-class-spec.svg?style=flat-square)](https://www.npmjs.org/package/jest-class-spec)

# Jest class spec

Write tests using a class. The constructur works as beforeEach, meaning a new instance is created for every test method. Methods starting with `should` are seen as test methods (it/test in jest). This
allows tests to access variables defined in the setup block.

```typescript
runSpec(
  class MySpecName {
    context = {
      user: { firstName: 'Torkel', lastName: 'Grafana' },
      auth: { isLoggedIn: true }
    };

    service = new OrderService(this.context, { logging: true })

    'should be able to access variable with inferred type full auto-complete and type check'() {
      expect(this.context.auth.isLoggedIn).toBe(true);
    }

    'should run each test method in a separate instance'() {
      const order = this.service.createOrder();
      expect(order.user.firstName).toBe(this.context.user.firstName);
    }
  }
);

```

**Wait is this not the same as this?**

```typescript
describe("Order service", () => {
  context = {
    user: { firstName: 'Torkel', lastName: 'Grafana' },
    auth: { isLoggedIn: true }
  };

  service = new MyService(this.context, { logging: true })

  it('should be able to access dynamic types with full intellisense and type check', () => {
    expect(this.context.auth.isLoggedIn).toBe(true);
  }

  it('should run each test method in a separate instance', () => {
    const newOrder = this.service.createOrder();
    expect(order.user.firstName).toBe(this.context.user.firstName);
  });
})
```

No this is not the same. In the above example context & service variables will only be created once and shared in both tests, so a side-effect / state modification in the first test can impact the next. That
is why setup code like the above is seen as bad and why using a beforeEach block is better.


## Motivation / Why?


The current model for beforeEach is deeply flawed as you cannot define variables inside the beforeEach function that are accessible from the test. You have to define nullable/undefined variables in an outer scope.
This is especially problematic for dynamic/inferred types or typescript with strict null checks. You cannot create const variables and have to resort to tricks like this:

```typescript
let aVar: SomeType | undefined;

beforeEach( ()=> {
   aVar = new SomeType;
   // This variable is not accessible by test and would require a type new definition for an outer variable :(
   const context = {
       prop1: 'hello';
       prop2: true,
   }
   // This is not accessible
   const service = new MyService(context);
});

test("A Test", ()=> {
    // Argh! I want to access the service and and the context variables :(
});
```

## More examples

If you have `experimentalDecorators` enabled in your tsconfig you can use runSpec as a decorator

```typescript
@runSpec
export class Given_login_service_with_anonymous_user {
  const user = new User({isAnonymous: true})
  const loginService = new LoginService(this.user)

  'Should deny access'() {
    expect(loginService.hasAccessToAdmin()).toBe(false)
  }
}
```

## Try it out

NPM

```
npm install jest-spec-class --save-dev
```

Yarn
```
yarn add --dev jest-spec-class
```

Then from your code just import it like

```typescript
import { runSpec } from '../src/index'
```

Think this problem should be addressed in the core Jest library? Then comment on this [feature request](https://github.com/facebook/jest/issues/10886)
