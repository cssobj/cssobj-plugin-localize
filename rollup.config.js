// rollup.config.js

export default {
  entry: 'src/cssobj-plugin-selector-localize.js',
  moduleName: 'cssobj_plugin_selector_localize',
  moduleId: 'cssobj_plugin_selector_localize',
  targets: [
    { format: 'iife', dest: 'dist/cssobj-plugin-selector-localize.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj-plugin-selector-localize.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj-plugin-selector-localize.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj-plugin-selector-localize.es.js'   }
  ]
}
