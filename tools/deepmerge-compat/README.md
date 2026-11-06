# Patched deepmerge compatibility package

This local package vendors the dependency-free CommonJS distribution and type declarations of [deepmerge 4.3.1](https://github.com/TehShrike/deepmerge/tree/v4.3.1), under its original MIT license. It is used through a package-manager override, so consumers retain the deepmerge 4 API without installing the vulnerable upstream package.

The patch addresses [GHSA-gcqx-w48m-w2h4 / CVE-2026-93753](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). Both target and source keys reject `__proto__`, `constructor` and `prototype` before values are read or copied. All destination writes use own data properties, and failed prototype-membership checks fail closed. The other upstream behavior, including array/custom merging, cloning, symbols and `.all()`, is retained. There is no upstream patched release at the time of this change.

Source archive: https://registry.npmjs.org/deepmerge/-/deepmerge-4.3.1.tgz

Verified npm integrity: `sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==`.

Regression tests are in `index.test.cjs`. Replace this fork with a reviewed upstream fix when one becomes available.
