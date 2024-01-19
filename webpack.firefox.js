/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = (env, options) => {
    return require("./webpack.common")(env, {
        ...options,
        browser: "firefox"
    });
};