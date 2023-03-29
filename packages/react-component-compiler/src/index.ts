import {
  Project,
  SourceFile,
  SyntaxKind,
  FunctionDeclaration,
  VariableDeclaration,
  ImportDeclaration,
  Node,
  ImportSpecifier,
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
        if (componentFn?.getKind() === SyntaxKind.ArrowFunction) {
          flat.set(
            componentFn.getFirstAncestorByKindOrThrow(
              SyntaxKind.VariableDeclaration
            ),
            true
          );
        } else if (componentFn) {
          flat.set(
            componentFn.getFirstAncestorByKindOrThrow(
              SyntaxKind.FunctionDeclaration
            ),
            true
          );
        }

        return flat;
      }, new Map<VariableDeclaration | FunctionDeclaration, boolean>())
      .keys()
  );
};

export const checkForClientComponents = (
  component: VariableDeclaration | FunctionDeclaration,
  imports: ImportSpecifier[]
) => {
  let isClient = false;

  const checkDeclarations = (node: Node) => {
    const symbol = node!
    .getSymbol()

    isClient ||= !!symbol &&
      !!symbol.getDeclarations()
      .find((declaration) => {
        return (
          ~imports.indexOf(declaration as ImportSpecifier) ||
          declaration.getSourceFile().getBaseName() === "lib.dom.d.ts"
        );
      });

    if (node.getKind() === SyntaxKind.CallExpression && !isClient) {
      isClient ||= !!(() => {
        const child = node.getFirstChild()
        
        const identifier = child!.getKind() === SyntaxKind.Identifier ? child! : child!.getLastChildByKindOrThrow(SyntaxKind.Identifier) 
        
        const declarations = identifier!.getSymbol()!.getDeclarations()

        return declarations?.forEach(decl => decl.forEachDescendant(checkDeclarations))
      })
    }

    return isClient
  }
  
  component.forEachDescendant(checkDeclarations)

  return isClient;
};