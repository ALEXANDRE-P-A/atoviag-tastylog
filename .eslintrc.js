module.exports = {
    "env": {
      "browser": true,
      "jquery": true,
      "commonjs": true,
      "es2021": true,
      "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 12
    },
    "rules": {
      "semi": [
        "error",
        "always"
      ],
      "no-unused-vars": [
        "error",
        {
          "vars": "all",
          "args": "none"
        }
      ],
      "no-console": [
        "off"
      ]
    }
  };
  