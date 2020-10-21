export default [
  {
    target: 'browser',
    cjs: { type: 'babel', lazy: true },
    disableTypeCheck: true,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'uxcore', camel2DashComponentName: false },
      ],
    ],
  },
];
