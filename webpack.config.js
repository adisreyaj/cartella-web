const { patchPostCSS } = require('@ngneat/tailwind');

module.exports = (config) => {
  const tailwindConfig = require('./tailwind.config.js');
  patchPostCSS(config, tailwindConfig, true);
  return config;
};
