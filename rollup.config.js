export default {
	entry: './index.js',
    exports: 'named',
	targets: [
		{format: 'cjs', dest: 'dist/snippets-registry.cjs.js'},
		{format: 'es',  dest: 'dist/snippets-registry.es.js'}
	]
};
