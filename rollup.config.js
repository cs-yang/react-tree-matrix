import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/TreeMatrix.js',
    output:{
        file: 'lib/tree-matrix.js',
        sourcemap: true,
        format: 'cjs',
        exports: 'named',
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        css({
            output: 'lib/tree-matrix.css'
        }),
        commonjs({
            include: 'node_modules/**',
            extensions: ['.js'],
            ignoreGlobal: false,
            sourceMap: false,
            namedExports: { 'react': ['createElement', 'Component']},
            ignore: ['conditional-runtime-dependency']
        })
    ],
    external: ['react']
}