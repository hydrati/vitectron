import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import Counter from '../components/Counter'

export default defineComponent({
  name: 'PageBlank',
  setup () {
    return () => (
      <>
        <h1>Here is Page 2!</h1>
        <p>
          <RouterLink to="/">Home page</RouterLink>
          {' | '}
          <Counter />
        </p>
      </>
    )
  }
})
