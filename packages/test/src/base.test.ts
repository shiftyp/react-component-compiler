import test, { TestFn } from "ava"
import { ImportDeclaration, Project } from 'ts-morph'
import { project, findComponents, getReactImport, checkForClientHooks } from 'react-component-compiler'
import path from "path"

const fixturesConfig = require.resolve('test-fixtures')
const fixturesDir = path.dirname(fixturesConfig)

const fromFixtures = (path: string) => `${fixturesDir}/${path}`

const projectTest = test as TestFn<{ project: Project, react: ImportDeclaration }>

projectTest.beforeEach(t => {
  t.context.project = project(fixturesConfig);
  t.assert(t.context.project instanceof Project)
})

projectTest.serial('find components', t => {
  const base = t.context.project.getSourceFile(fromFixtures('base/index.tsx'))
  t.assert(base, "base file is defined")
  const components = findComponents(base!)

  t.assert(components.length === 1, 'There is one component')
})

projectTest.serial('should find react', t => {
  const base = t.context.project.getSourceFile(fromFixtures('base/index.tsx'))
  const react = getReactImport(base!)

  t.assert(react)
})

projectTest.serial('should not find client hooks', t => {
  const base = t.context.project.getSourceFile(fromFixtures('base/index.tsx'))
  const react = getReactImport(base!) 
  const imports = checkForClientHooks(react!)

  t.assert(imports.length === 0)
})