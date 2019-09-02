import Vue from 'vue'
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
// import { ImageResize } from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'
import { ImageExtend } from 'quill-image-extend-module'
import App from './App.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

window.Quill = Quill

Vue.config.productionTip = false

// Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageExtend', ImageExtend)

Vue.component('quill-editor', quillEditor)

new Vue({
  render: h => h(App),
}).$mount('#app')
