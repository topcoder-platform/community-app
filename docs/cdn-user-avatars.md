# CDN: User Avatars
Community App&apos;s CDN can server Topcoder User Avatars rescaled to the size you
need, and you can easily use it from other apps!

Wherever TC API gives you an avatar URL, usually called `photoURL`, you should
replace it by:
```js
`${cdnBaseUrl}/avatar/${encodeUriComponent(photoURL)}?size=${size}`
```
where `cdnBaseUrl` should be `https://d1aahxkjiobka8.cloudfront.net` for dev
environment, or `https://d2nl5eqipnb33q.cloudfront.net` for prod environment;
`size` is the target avatar size (the actual avatar image will be rescaled,
if necessary, to fit into `size` &times; `size` square, preserving the original
aspect ratio of the image).

The CDN will take care about proper normalization of current and legacy avatar
URLs to the necessary paths, but be sure to check that `photoURL` is defined
(if not defined, the CDN call will respond with error).
