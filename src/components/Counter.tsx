import { defineComponent } from 'vue'
import { useStore } from '../index.state'

export default defineComponent({
  name: 'Counter',
  setup () {
    const state = useStore()
    const handleClick = () => state.addOne()
    const handleShowVersion = () => windowBridge.sendToMain('show-app-version')

    return () => (
      <>
        <button onClick={handleClick}>Click me! Count: {state.count}</button>
        <p>
          <button onClick={handleShowVersion}>Show App Version</button>
        </p>
      </>
    )
  }
})
