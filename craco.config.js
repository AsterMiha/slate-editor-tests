/* Config based on https://github.com/ckeditor/ckeditor5/issues/7836#issuecomment-1171455584 */

const { styles } = require("@ckeditor/ckeditor5-dev-utils");

const getLoaderByRegex = (loaders, regex) => loaders.find(
	item => !Array.isArray(item.test) && (String(item.test) === String(regex))
);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const CKEditorRegExp = {
	cssExp: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
	svgExp: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
};

const CKEditor5WebpackConfigPlugin = {
	overrideWebpackConfig: ({ webpackConfig, options = {} }) => {
		// Extract the oneOf array from the relevant webpack.module.rules object
		const { oneOf } = webpackConfig.module.rules.find(rule => rule.oneOf);

		// Add the SVG and CSS loaders to the oneOf array in the first position. 
		// As oneOf array uses the first loader that matches the value of test, we need to ensure that
		// SVGs and CSS files from ckeditor5 folder inside node_module, are using the correct loaders 
		// provided on documentation: https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/alternative-setups/integrating-from-source.html#webpack-configuration
		oneOf.unshift(
			{
				// ASSET-MODULES replaces raw-loader - https://webpack.js.org/guides/asset-modules/
				test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
				type: 'asset/source'
			},
			{
				test: CKEditorRegExp.cssExp,
				use: [
					{
						loader: "style-loader",
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: styles.getPostCssConfig({
								themeImporter: {
									themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
								},
								minify: true
							})
						}
					}
				]
			}
		);

		// Make sure cssRegex doesn't use loader for CKEditor5
		getLoaderByRegex(oneOf, cssRegex).exclude = [cssModuleRegex, CKEditorRegExp.cssExp];
		// Make sure cssModuleRegex doesn't use loader for CKEditor5
		getLoaderByRegex(oneOf, cssModuleRegex).exclude = [CKEditorRegExp.cssExp];

		return webpackConfig;
	}
};

module.exports = {
  plugins: [{
    plugin: CKEditor5WebpackConfigPlugin
  }]
};
