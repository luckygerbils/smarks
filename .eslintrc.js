/* eslint-env node */
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "webextensions": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [ ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off"
    },
    "ignorePatterns": [
        "dist/**/*"
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    }
}
