import { app } from './app'
import { env } from './env'


// Lançar o server
app
  .listen({
    port: env.PORT,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  })
  .catch(() => {
    console.log('Error running server')
  })
