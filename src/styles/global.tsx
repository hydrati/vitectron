import { injectGlobal } from '@emotion/css'

injectGlobal`
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
`

injectGlobal`
p {
  font-size: 1.05em;
}

a {
  color: #41B883;
}

code {
  color: white;
  padding: 4px;
  border-radius: 3px;
  background: #2F3242;
  display: inline-block;
  font-family: 'Consolas';
}
`
