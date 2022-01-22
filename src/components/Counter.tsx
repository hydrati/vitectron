import { defineComponent } from 'vue'
import { useStore } from '../index.state'

export default defineComponent({
  name: 'Counter',
  setup () {
    const state = useStore()
    const handleClick = () => state.addOne()

    return () => (
      <>
        <button onClick={handleClick}>Click me! Count: {state.count}</button>
      </>
    )
  }
})
