module.exports = {
  presets: [
    [
      '@babel/preset-react',
      '@babel/env',
      '@babel/react',
      {
        targets: {
          ie: '11',
        },
      },
    ],
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    'add-module-exports',
    '@babel/plugin-transform-typescript',
    '@babel/plugin-transform-runtime',
  ],
};
