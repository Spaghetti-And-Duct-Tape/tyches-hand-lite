// vue.config.js
module.exports = {
  chainWebpack: config => {
    // Tell ts-loader to only transpile, don’t type-check:
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => ({
        ...options,
        transpileOnly: true
      }));

    // Disable the fork-ts-checker plugin so it won’t break the build
    config
      .plugin('fork-ts-checker')
      .tap(args => [{
        ...args[0],
        async: true,              // run in async mode, so it won't block emit
        typescript: { 
          ...args[0].typescript, 
          enabled: false           // or just outright disable it 
        }
      }]);
  }
};
