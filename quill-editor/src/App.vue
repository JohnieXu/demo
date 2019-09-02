<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="100">
    <h4>quill-editor</h4>
    <quill-editor
      ref="editor"
      :content="editorContent"
      :options="editorOptions"
    ></quill-editor>
    <h4>wangeditor</h4>
    <wang-editor v-model="wnageditorContent"></wang-editor>
  </div>
</template>

<script>
import {container, QuillWatch} from 'quill-image-extend-module'
import WangEditor from '@/components/Editor'

export default {
  name: 'app',
  components: {
    WangEditor
  },
  data () {
    return {
      editorShow: true,
      editorOptions: {
        imageResize: true,
        imageDrop: true,
        imageExtend: {
          loading: true,
          name: 'img',
          action: 'http://test.whbeishu.com/api/common/upload/image',
          response: (res) => res.data.data
        },
        toolbar: {
          container: container,
          handlers: {
            'image': () => {
              // eslint-disable-next-line
              console.log(this)
              QuillWatch.emit(this.quill.id)
            }
          }
        }
      },
      editorContent: '',
      wnageditorContent: ''
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
