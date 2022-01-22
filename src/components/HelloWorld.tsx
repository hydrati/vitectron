import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    message: String
  },
  setup (props) {
    return () => (
      <>
        <h1>{props.message}</h1>
        <p>
          Recommended IDE setup: 
          &nbsp;<a href="https://code.visualstudio.com/">VSCode</a>&nbsp;+&nbsp;
          <a href="https://marketplace.visualstudio.com/items?itemName=octref.vetur">Vetur</a>
          &nbsp;or&nbsp;
          <a href="https://github.com/johnsoncodehk/volar">Volar</a>
          &nbsp;( if using <code>{'<script setup>'}</code> )
        </p>
        <p>See <code>README.md</code> for more information.</p>
        <br />
        <p>
          <a href="https://v3.vuejs.org/">Vue Docs</a> | <a href="https://electronjs.org/">Electron Docs</a> | <a href="https://vitejs.dev">Vite Docs</a>
        </p>
      </>
    )
  }
})
