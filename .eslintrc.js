module.exports = {
	"extends": [
		"eslint:recommended",
		"plugin:vue/recommended"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"quotes": ["warn", "single"],
		"import/no-unresolved": 0,
		"import/no-unassigned-import": 0,
		"semi": ["error", "never"],
		"no-console": "off",
		"space-before-function-paren": [
			"error",
			{
				"anonymous": "always",
				"named": "always",
				"asyncArrow": "always"
			}
		]
	}
}