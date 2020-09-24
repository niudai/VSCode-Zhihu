module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/all",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "ignorePatterns": [],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/ban-ts-ignore": [
            "error"
        ],
        "@typescript-eslint/class-name-casing": [
            "error"
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit",
                "overrides": {
                    "accessors": "explicit",
                    "constructors": "explicit",
                    "parameterProperties": "explicit"
                }
            }
        ],
        "@typescript-eslint/interface-name-prefix": [
            "error"
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-param-reassign": [
            "error"
        ],
        "@typescript-eslint/quotes": [
            "error",
            "double",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "arrow-body-style": [
            "error",
            "always"
        ],
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "camelcase": "error",
        "capitalized-comments": [
            "error",
            "always"
        ],
        "class-methods-use-this": [
            "error"
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "complexity": "off",
        "constructor-super": "error",
        "curly": [
            "error"
        ],
        "default-case": [
            "error"
        ],
        "dot-notation": "error",
        "eol-last": [
            "error"
        ],
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "error",
        "import/no-default-export": [
            "error"
        ],
        "import/no-deprecated": [
            "error"
        ],
        "import/no-extraneous-dependencies": [
            "error"
        ],
        "import/no-internal-modules": [
            "error"
        ],
        "import/no-unassigned-import": [
            "error"
        ],
        "import/order": [
            "error"
        ],
        "jsdoc/no-types": [
            "error"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-classes-per-file": [
            "error",
            1
        ],
        "max-len": [
            "error",
            {
                "code": 120
            }
        ],
        "max-lines": [
            "error",
            1000
        ],
        "new-parens": "error",
        "newline-per-chained-call": [
            "error"
        ],
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-duplicate-case": [
            "error"
        ],
        "no-duplicate-imports": [
            "error"
        ],
        "no-empty": "error",
        "no-eval": "error",
        "no-extra-bind": [
            "error"
        ],
        "no-irregular-whitespace": [
            "error"
        ],
        "no-magic-numbers": [
            "error"
        ],
        "no-multiple-empty-lines": [
            "error"
        ],
        "no-new-func": [
            "error"
        ],
        "no-new-wrappers": "error",
        "no-null/no-null": [
            "error"
        ],
        "no-plusplus": [
            "error",
            {
                "allowForLoopAfterthoughts": true
            }
        ],
        "no-redeclare": [
            "error"
        ],
        "no-restricted-syntax": [
            "error",
            "ForInStatement"
        ],
        "no-return-await": [
            "error"
        ],
        "no-sequences": [
            "error"
        ],
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-sparse-arrays": [
            "error"
        ],
        "no-template-curly-in-string": [
            "error"
        ],
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-var": [
            "error"
        ],
        "no-void": [
            "error"
        ],
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": "*",
                "next": "return"
            }
        ],
        "prefer-arrow/prefer-arrow-functions": "error",
        "prefer-const": [
            "error"
        ],
        "prefer-object-spread": [
            "error"
        ],
        "prefer-template": [
            "error"
        ],
        "quote-props": [
            "error",
            "consistent-as-needed"
        ],
        "radix": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "never",
                "asyncArrow": "always",
                "named": "never"
            }
        ],
        "space-in-parens": [
            "error",
            "always"
        ],
        "spaced-comment": "error",
        "unicorn/filename-case": [
            "error"
        ],
        "use-isnan": "error",
        "yoda": [
            "error"
        ],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "comment-type": true,
                    "completed-docs": true,
                    "encoding": true,
                    "import-spacing": true,
                    "invalid-void": true,
                    "jsdoc-format": true,
                    "match-default-export-name": true,
                    "no-boolean-literal-compare": true,
                    "no-default-import": true,
                    "no-dynamic-delete": true,
                    "no-inferred-empty-object-type": true,
                    "no-mergeable-namespace": true,
                    "no-null-undefined-union": true,
                    "no-promise-as-boolean": true,
                    "no-reference-import": true,
                    "no-restricted-globals": true,
                    "no-tautology-expression": true,
                    "no-unnecessary-callback-wrapper": true,
                    "no-unsafe-any": true,
                    "number-literal-format": true,
                    "object-literal-sort-keys": true,
                    "one-line": true,
                    "prefer-conditional-expression": true,
                    "prefer-method-signature": true,
                    "prefer-switch": true,
                    "prefer-while": true,
                    "return-undefined": true,
                    "static-this": true,
                    "strict-comparisons": true,
                    "strict-string-expressions": true,
                    "strict-type-predicates": true,
                    "switch-final-break": true,
                    "typedef": true,
                    "unnecessary-else": true,
                    "whitespace": true
                }
            }
        ],
        "@typescript-eslint/adjacent-overload-signatures": [
            "error"
        ],
        "@typescript-eslint/array-type": [
            "error"
        ],
        "@typescript-eslint/await-thenable": [
            "error"
        ],
        "@typescript-eslint/ban-ts-comment": [
            "error"
        ],
        "@typescript-eslint/ban-types": [
            "error"
        ],
        "brace-style": [
            "off"
        ],
        "@typescript-eslint/brace-style": [
            "error"
        ],
        "comma-spacing": [
            "off"
        ],
        "@typescript-eslint/comma-spacing": [
            "error"
        ],
        "@typescript-eslint/consistent-type-assertions": [
            "error"
        ],
        "@typescript-eslint/consistent-type-definitions": [
            "error"
        ],
        "default-param-last": [
            "off"
        ],
        "@typescript-eslint/default-param-last": [
            "error"
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "error"
        ],
        "@typescript-eslint/explicit-module-boundary-types": [
            "error"
        ],
        "func-call-spacing": [
            "off"
        ],
        "@typescript-eslint/func-call-spacing": [
            "error"
        ],
        "indent": [
            "off"
        ],
        "@typescript-eslint/indent": [
            "error"
        ],
        "@typescript-eslint/member-ordering": [
            "error"
        ],
        "@typescript-eslint/naming-convention": [
            "error"
        ],
        "no-array-constructor": [
            "off"
        ],
        "@typescript-eslint/no-array-constructor": [
            "error"
        ],
        "@typescript-eslint/no-base-to-string": [
            "error"
        ],
        "no-dupe-class-members": [
            "off"
        ],
        "@typescript-eslint/no-dupe-class-members": [
            "error"
        ],
        "@typescript-eslint/no-dynamic-delete": [
            "error"
        ],
        "no-empty-function": [
            "off"
        ],
        "@typescript-eslint/no-empty-function": [
            "error"
        ],
        "@typescript-eslint/no-empty-interface": [
            "error"
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-extra-non-null-assertion": [
            "error"
        ],
        "no-extra-parens": [
            "off"
        ],
        "@typescript-eslint/no-extra-parens": [
            "error"
        ],
        "no-extra-semi": [
            "off"
        ],
        "@typescript-eslint/no-extra-semi": [
            "error"
        ],
        "@typescript-eslint/no-extraneous-class": [
            "error"
        ],
        "@typescript-eslint/no-floating-promises": [
            "error"
        ],
        "@typescript-eslint/no-for-in-array": [
            "error"
        ],
        "@typescript-eslint/no-implied-eval": [
            "error"
        ],
        "@typescript-eslint/no-inferrable-types": [
            "error"
        ],
        "@typescript-eslint/no-magic-numbers": [
            "error"
        ],
        "@typescript-eslint/no-misused-new": [
            "error"
        ],
        "@typescript-eslint/no-misused-promises": [
            "error"
        ],
        "@typescript-eslint/no-namespace": [
            "error"
        ],
        "@typescript-eslint/no-non-null-asserted-optional-chain": [
            "error"
        ],
        "@typescript-eslint/no-non-null-assertion": [
            "error"
        ],
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-require-imports": [
            "error"
        ],
        "@typescript-eslint/no-this-alias": [
            "error"
        ],
        "@typescript-eslint/no-throw-literal": [
            "error"
        ],
        "@typescript-eslint/no-type-alias": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-condition": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-qualifier": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-type-arguments": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-type-assertion": [
            "error"
        ],
        "@typescript-eslint/no-unsafe-call": [
            "error"
        ],
        "@typescript-eslint/no-unsafe-member-access": [
            "error"
        ],
        "@typescript-eslint/no-unsafe-return": [
            "error"
        ],
        "@typescript-eslint/no-unused-expressions": [
            "error"
        ],
        "no-unused-vars": [
            "off"
        ],
        "@typescript-eslint/no-unused-vars": [
            "error"
        ],
        "@typescript-eslint/no-unused-vars-experimental": [
            "error"
        ],
        "no-use-before-define": [
            "off"
        ],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-useless-constructor": [
            "error"
        ],
        "@typescript-eslint/no-var-requires": [
            "error"
        ],
        "@typescript-eslint/prefer-as-const": [
            "error"
        ],
        "@typescript-eslint/prefer-for-of": [
            "error"
        ],
        "@typescript-eslint/prefer-function-type": [
            "error"
        ],
        "@typescript-eslint/prefer-includes": [
            "error"
        ],
        "@typescript-eslint/prefer-namespace-keyword": [
            "error"
        ],
        "@typescript-eslint/prefer-nullish-coalescing": [
            "error"
        ],
        "@typescript-eslint/prefer-optional-chain": [
            "error"
        ],
        "@typescript-eslint/prefer-readonly": [
            "error"
        ],
        "@typescript-eslint/prefer-readonly-parameter-types": [
            "error"
        ],
        "@typescript-eslint/prefer-regexp-exec": [
            "error"
        ],
        "@typescript-eslint/prefer-string-starts-ends-with": [
            "error"
        ],
        "@typescript-eslint/promise-function-async": [
            "error"
        ],
        "quotes": [
            "off"
        ],
        "@typescript-eslint/require-array-sort-compare": [
            "error"
        ],
        "require-await": [
            "off"
        ],
        "@typescript-eslint/require-await": [
            "error"
        ],
        "@typescript-eslint/restrict-plus-operands": [
            "error"
        ],
        "@typescript-eslint/restrict-template-expressions": [
            "error"
        ],
        "@typescript-eslint/return-await": [
            "error"
        ],
        "semi": [
            "off"
        ],
        "@typescript-eslint/space-before-function-paren": [
            "error"
        ],
        "@typescript-eslint/strict-boolean-expressions": [
            "error"
        ],
        "@typescript-eslint/switch-exhaustiveness-check": [
            "error"
        ],
        "@typescript-eslint/triple-slash-reference": [
            "error"
        ],
        "@typescript-eslint/type-annotation-spacing": [
            "error"
        ],
        "@typescript-eslint/typedef": [
            "error"
        ],
        "@typescript-eslint/unbound-method": [
            "error"
        ],
        "@typescript-eslint/unified-signatures": [
            "error"
        ],
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "valid-typeof": "off"
    },
    "settings": {}
};
