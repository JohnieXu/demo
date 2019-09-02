<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <editor v-model="editorContent"></editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Editor from '@/components/Editor';

@Component({
  components: {
    HelloWorld,
    Editor,
  },
  data() {
    return {
      editorContent: '',
    };
  },
})
export default class Home extends Vue {}
</script>
