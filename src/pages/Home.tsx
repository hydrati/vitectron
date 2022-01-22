import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import Counter from '../components/Counter'
import HelloWorld from '../components/HelloWorld'
import Logo from '../components/Logo'

export default defineComponent({
  name: 'PageHome',
  setup () {
    return () => (
      <>
        <Logo />
        <HelloWorld message="Hello Vue + Electron" />
        <p>
          <RouterLink to="/blank">Next page</RouterLink>
          {' | '}
          <Counter />
        </p>
      </>
    )
  }
})
