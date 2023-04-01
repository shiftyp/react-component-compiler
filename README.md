# React Component Compiler

## Goal

Allow the use of server components and client components through bundle splitting and boilerplate generation

## Rationale

Server components are cool! Frameworks may not be. It would be nice to be able to use the React Server Component's feature more directly, without using a framework or writing extra code

## Inspiration

The spark for this idea came, oddly enough, from the NextJS docs, which contains this table for splitting up Client and Server components:

|                            What do you need to do?                           | Server Component | Client Component |
|:----------------------------------------------------------------------------:|:----------------:|:----------------:|
| Fetch data.                                                      | ✅                | ⚠️                |
| Access backend resources (directly)                                          | ✅                | ❌                |
| Keep sensitive information on the server (access tokens, API keys, etc)      | ✅                | ❌                |
| Keep large dependencies on the server / Reduce client-side JavaScript        | ✅                | ❌                |
| Add interactivity and event listeners (onClick(), onChange(), etc)           | ❌                | ✅                |
| Use State and Lifecycle Effects (useState(), useReducer(), useEffect(), etc) | ❌                | ✅                |
| Use browser-only APIs                                                        | ❌                | ✅                |
| Use custom hooks that depend on state, effects, or browser-only APIs         | ❌                | ✅                |
| Use React Class components                                                   | ❌                | ✅                |

These rules might allow for the client and server components to be identified automatically through AST navigation, and the associated code split into client and server bundles

## Methodology

The general rule would be, default to splitting components into server components. If we can determine client dependencies, make the decision to split into a client component. If we can't determine the dependencies, make it a client component for safety. Allow overrides to fine tune the decisions and handle indeterminate edge cases.