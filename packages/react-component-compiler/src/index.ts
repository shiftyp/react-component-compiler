import {
  Project,
  SourceFile,
  SyntaxKind,
  FunctionDeclaration,
  VariableDeclaration,
  ImportDeclaration,
  Node,
  ImportSpecifier,
  CallExpression,
  Identifier,
  ArrowFunction,
  FunctionExpression,
  ElementAccessExpression,
} from "ts-morph";

export const project = (path: string = `${process.cwd}/tsconfig.json`) =>
  new Project({
    tsConfigFilePath: path,
  });

export const getReactImport = (sourceFile: SourceFile) => {
  return sourceFile.getImportDeclaration("react");
};

export const checkForClientHooks = (declaration: ImportDeclaration) => {
  const imports = declaration.getNamedImports().filter((name) => {
    return ~[
      "useState",
      "useEffect",
      "useContext",
      "useReducer",
      "useCallback",
      "useMemo",
      "useRef",
      "useLayoutEffect",
      "useInsertionEffect",
      "useId",
      "useRef",
    ].indexOf(name.getName());
  });

  return imports;
};

export const findComponents = (sourceFile: SourceFile) => {
  return Array.from(
    sourceFile
      .getDescendantsOfKind(SyntaxKind.JsxElement)
      .reduce((flat, element) => {
        const componentFn = element
          .getAncestors()
          .reverse()
          .find(
            (ancestor) =>
              ~[
                SyntaxKind.ArrowFunction,
                SyntaxKind.FunctionExpression,
              ].indexOf(ancestor.getKind())
          );
        if (!componentFn) {
          throw new Error(
            `JSX outside of components not supported: ${sourceFile.getBaseName()}, Line ${element.getStartLineNumber()}`
          );
        }

        flat.set(componentFn as ArrowFunction | FunctionExpression, true);

        return flat;
      }, new Map<ArrowFunction | FunctionExpression, boolean>())
      .keys()
  );
};

export const checkForClientComponents = (
  component: ArrowFunction | FunctionExpression,
  imports: ImportSpecifier[]
) => {
  const checkIdentifier = (node: Node) => {
    const symbol = node!.getSymbol();
    return !!symbol!.getDeclarations().find((declaration) => {
      return (
        (declaration instanceof ImportSpecifier &&
          ~imports.indexOf(declaration)) ||
        declaration.getSourceFile().getBaseName() === "lib.dom.d.ts"
      );
    });
  };

  const checkIdentifiers = (node: Node) =>
    !!node &&
    !!node.getDescendantsOfKind(SyntaxKind.Identifier).find(checkIdentifier);

  const checkFunctionDefinition = (node: Node | undefined | null): boolean => {
    let definition: Node | null | undefined = node;

    while (
      definition &&
      definition.getKind() !== SyntaxKind.ArrowFunction &&
      definition.getKind() !== SyntaxKind.FunctionExpression
    ) {
      if (
        definition.getKind() === SyntaxKind.Identifier &&
        checkIdentifier(definition)
      ) {
        return true;
      }

      if (definition.getKind() === SyntaxKind.CallExpression) {
        definition =
          definition.getLastChildByKind(SyntaxKind.Identifier) ||
          definition.getLastChildByKind(SyntaxKind.PropertyAccessExpression) ||
          definition.getLastChildByKind(SyntaxKind.ElementAccessExpression) ||
          definition.getLastChildByKind(SyntaxKind.ArrowFunction) ||
          definition.getLastChildByKind(SyntaxKind.FunctionExpression);
        continue;
      }

      if (definition.getKind() === SyntaxKind.PropertyAccessExpression) {
        definition = definition.getLastChildByKind(SyntaxKind.Identifier)
        continue
      }

      if (definition.getKind() === SyntaxKind.ElementAccessExpression) {
        return true
      }

      const declarations = definition.getSymbol()!.getDeclarations();

      definition = declarations?.reduce<Node | null | undefined>((_, decl) => {
        switch (decl.getKind()) {
          case SyntaxKind.VariableDeclaration:
            return decl.getLastChildByKind(SyntaxKind.ArrowFunction);
          case SyntaxKind.FunctionDeclaration:
            return decl;
          case SyntaxKind.PropertyDeclaration:
            return (
              decl.getLastChildByKind(SyntaxKind.ArrowFunction) ||
              decl.getLastChildByKind(SyntaxKind.FunctionExpression) ||
              decl.getLastChildByKind(SyntaxKind.Identifier)
            );
          case SyntaxKind.ShorthandPropertyAssignment:
            const name = decl.getLastChildByKind(SyntaxKind.Identifier)?.getText()!
            const tmp = decl.replaceWithText(`${name}: ${name}`)
            const def = tmp.getLastChildByKind(SyntaxKind.Identifier)!.getSymbol()!.getDeclarations()[0]!
            tmp.replaceWithText(name)
            return def
          default:
            return null
        }
      }, null);
    }
    if (!definition) {
      return true
    }
    return checkIdentifiers(definition) || checkFunctionDefinitions(definition);
  };

  const checkFunctionDefinitions = (node: Node | undefined | null) =>
    !!node &&
    !!node
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .find(checkFunctionDefinition);

  return checkIdentifiers(component) || checkFunctionDefinitions(component);
};
