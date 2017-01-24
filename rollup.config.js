export default {
	entry: './index.js',
	targets: [
		{format: 'cjs', dest: 'dist/snippets-registry.cjs.js'},
		{format: 'es',  dest: 'dist/snippets-registry.es.js'}
	]
};
