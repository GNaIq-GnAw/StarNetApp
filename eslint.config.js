import {FlatCompat} from "@eslint/eslintrc";
import uniHelper from "@uni-helper/eslint-config";

const compat = new FlatCompat();

export default uniHelper(
    {
        unocss: true,
        stylistic: {
            indent: 4,
            quotes: "double",
            semi: true
        },
        ignores: ["**/uni_modules", "**/typings", "**/unpackage", "**/uniCloud-aliyun"],
        rules: {
            "style/comma-dangle": "off",
            "style/object-curly-spacing": ["error", "never"],
            "vue/script-indent": [
                "error",
                4,
                {
                    baseIndent: 1,
                    switchCase: 1,
                    ignores: []
                }
            ],
            "style/indent": "off",
            "style/arrow-parens": "off",
            "style/brace-style": "off",
            "no-console": "off",
            "antfu/top-level-function": "off",
            "vue/object-curly-spacing": ["error", "never"],
            "style/quote-props": "off",
            "vue/singleline-html-element-content-newline": "off",
            "antfu/if-newline": "off",
            "ts/no-use-before-define": "off",
            "no-use-before-define": "off",
            "vue/comma-dangle": "off",
            "vue/brace-style": "off",
            "vue/operator-linebreak": "off",
            "eslint-comments/no-unlimited-disable": "off",
            eqeqeq: ["error", "always"]
        }
    },
    ...compat.config({
        extends: ["./src/typings/.eslintrc-auto-import.json"]
    })
);
