# minimatch CommonJS compatibility adapter

Some legacy Community App build plugins still call `require('minimatch')` as a
function. Maintained minimatch versions expose that function as the named
`minimatch` export.

This adapter preserves the old callable shape and forwards every operation and
named export to `minimatch@10.2.6`. It contains no matching implementation of
its own.
