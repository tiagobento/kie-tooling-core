require('../node_modules/monaco-editor/esm/vs/base/browser/ui/codiconLabel/codicon/codicon.css')

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    switch (label) {
      case 'typescript':
      case 'javascript':
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/language/typescript/ts.worker')
      default:
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/editor/editor.worker')
    }
  }
}

module.exports = require('monaco-editor')
