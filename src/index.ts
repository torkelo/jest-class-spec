import { describe, test } from '@jest/globals'

export interface SpecClass {
  new (): any
}

export const isTestMethodRegex = new RegExp('^should', 'i')

export function runSpec(Spec: SpecClass) {
  describe(Spec.constructor.name, () => {
    for (const method of getAllTestMethodNames(Spec)) {
      if (!method.match(isTestMethodRegex)) {
        continue
      }

      test(method, () => {
        const instance = new Spec()
        return instance[method](arguments)
      })
    }
  })
}

function getAllTestMethodNames(Spec: SpecClass | null): string[] {
  if (Spec == null) {
    return []
  }

  return Object.getOwnPropertyNames(Spec).concat(getAllTestMethodNames(Spec.prototype))
}
