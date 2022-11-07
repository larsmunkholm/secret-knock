module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    env: {
        browser: false,
        commonjs: true,
        es6: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
    plugins: ["react"],
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            plugins: ["@typescript-eslint"],
            extends: [
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
                "prettier",
            ],
            parserOptions: {
                project: "./tsconfig.json",
            },
            rules: {
                "@typescript-eslint/ban-ts-comment": ["off"],
                "@typescript-eslint/explicit-function-return-type": ["off"],
                "@typescript-eslint/explicit-module-boundary-types": ["off"],
                "@typescript-eslint/no-explicit-any": ["off"],
            },
        },
        {
            files: ["./packages/react-native/**/*.(ts|tsx)"],
            extends: ["@react-native-community"],
        },
    ],
    rules: {
        eqeqeq: ["error", "always"],
        "react/self-closing-comp": 0,
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",
    },
};
