import { runSpec } from '../src/index'

// this is to verify that the tests are executed
let testMethodsRun = 0

describe('TestRunSpec', () => {
  runSpec(
    class TestRunSpec {
      instanceVar = {
        stringTest: 'hello',
        boolTest: true
      }

      'should run this method as a test'() {
        expect(this.instanceVar.stringTest).toBe('hello')
        // try modify state and verify in the other test
        this.instanceVar.boolTest = false
        testMethodsRun++
      }

      'should run every method on a new instance'() {
        expect(this.instanceVar.boolTest).toBe(true)
        testMethodsRun++
      }

      'Should also run methods with capitalized Should'() {
        testMethodsRun++
      }
    }
  )

  it('should have executed all methods', () => {
    expect(testMethodsRun).toBe(3)
  })
})

let decoratorTestExecuted = false

@runSpec
export class DecoratorTest {
  'Should work with decorator'() {
    decoratorTestExecuted = true
  }
}

describe('Works as decorator', () => {
  it('has executued', () => {
    expect(decoratorTestExecuted).toBe(true)
  })
})
