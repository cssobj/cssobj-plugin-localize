// rollup.config.js

export default {
  entry: 'src/cssobj-plugin-localize.js',
  moduleName: 'cssobj_plugin_localize',
  amd: {id: 'cssobj_plugin_localize'},
  targets: [
    { format: 'iife', dest: 'dist/cssobj-plugin-localize.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj-plugin-localize.amd.js'  },
    { format: 'umd',  dest: 'dist/cssobj-plugin-localize.umd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj-plugin-localize.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj-plugin-localize.es.js'   }
  ]
}
