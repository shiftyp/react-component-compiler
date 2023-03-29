import test, { TestFn } from "ava"
import { ImportDeclaration, Project } from 'ts-morph'
import { project, findComponents, getReactImport, checkForClientHooks, checkForClientComponents } from 'react-component-compiler'
import path from "path"

const fixturesConfig = require.resolve('test-fixtures')
const fixturesDir = path.dirname(fixturesConfig)

const fromFixtures = (path: string) => `${fixturesDir}/${path}`

const clientTest = test as TestFn<{ project: Project, react: ImportDeclaration }>

clientTest.beforeEach(t => {
  t.context.project = project(fixturesConfig);
  t.assert(t.context.project instanceof Project)
})

clientTest.serial('find components', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  t.assert(client, "client file is defined")
  const components = findComponents(client!)

  const expected = 10

  t.assert(components.length === expected, `There are ${expected} components`)
})

clientTest.serial('should find react', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!)

  t.assert(react)
})

clientTest.serial('should find one client hook', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)

  t.assert(imports.length === 1)
})

clientTest.serial('should find client component with hook', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[0], imports!)

  t.assert(foundClientComponents)

})

clientTest.serial('should find client component with window reference', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[1], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with global DOM reference', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[2], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with aliased global DOM reference', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[3], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with custom client hook', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[4], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with aliased global DOM utility call', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[5], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with aliased window utility call', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[6], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with custom client hook property', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[7], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with aliased global DOM utility property call', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[8], imports!)

  t.assert(foundClientComponents)
})

clientTest.serial('should find client component with aliased window utility property call', t => {
  const client = t.context.project.getSourceFile(fromFixtures('client/index.tsx'))
  const react = getReactImport(client!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(client!)
  const foundClientComponents = checkForClientComponents(components[9], imports!)

  t.assert(foundClientComponents)
})