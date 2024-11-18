import { app } from './app'
import { env } from './env'


// Lançar o server
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server running')
  })
  .catch(() => {
    console.log('Error running server')
  })
