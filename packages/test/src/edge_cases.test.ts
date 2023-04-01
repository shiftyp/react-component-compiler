import test, { TestFn } from "ava"
import { ImportDeclaration, Project } from 'ts-morph'
import { project, findComponents, getReactImport, checkForClientHooks, checkForClientComponents } from 'react-component-compiler'
import path from "path"

const fixturesConfig = require.resolve('test-fixtures')
const fixturesDir = path.dirname(fixturesConfig)

const fromFixtures = (path: string) => `${fixturesDir}/${path}`

const edge_casesTest = test as TestFn<{ project: Project, react: ImportDeclaration }>

edge_casesTest.beforeEach(t => {
  t.context.project = project(fixturesConfig);
  t.assert(t.context.project instanceof Project)
})


edge_casesTest.serial('should find edge_cases component with custom edge_cases hook property', t => {
  const edge_cases = t.context.project.getSourceFile(fromFixtures('edge_cases/index.tsx'))
  const react = getReactImport(edge_cases!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(edge_cases!)
  const foundedge_casesComponents = checkForClientComponents(components[0], imports!)

  t.assert(foundedge_casesComponents)
})

edge_casesTest.serial('should find edge_cases component with aliased global DOM utility property call', t => {
  const edge_cases = t.context.project.getSourceFile(fromFixtures('edge_cases/index.tsx'))
  const react = getReactImport(edge_cases!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(edge_cases!)
  const foundedge_casesComponents = checkForClientComponents(components[1], imports!)

  t.assert(foundedge_casesComponents)
})

edge_casesTest.serial('should find edge_cases component with aliased window utility property call', t => {
  const edge_cases = t.context.project.getSourceFile(fromFixtures('edge_cases/index.tsx'))
  const react = getReactImport(edge_cases!) 
  const imports = checkForClientHooks(react!)
  const components = findComponents(edge_cases!)
  const foundedge_casesComponents = checkForClientComponents(components[2], imports!)

  t.assert(foundedge_casesComponents)
})