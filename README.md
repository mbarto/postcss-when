# postcss-when

[PostCSS] plugin that implements CSS conditions @when.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  visibility: hidden;
  @when (var(--foo-visible) = 1) {
    visibility: visible;
  }
}
```

```css
.foo {
  visibility: hidden;
  animation: 1s when-animation-1 paused;
  animation-delay: calc((1 - var(--selected-tab)) * 1s);
}

@keyframes when-animation-1 {
  from { visibility: visible}
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-when
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-when'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
