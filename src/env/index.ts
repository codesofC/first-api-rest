import { config } from 'dotenv'
import { z } from 'zod'


//Para fazer testes, tem que informar um outro banco de dados para os request
if(process.env.NODE_ENV === 'test'){
    config({ path: '.env.test', override: true })
}else{
    config({ path: '.env'})
}
console.log(process.env.NODE_ENV + ': ' + process.env.DATABASE_URL)

const envSchema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
    console.error('Invalid environment variables!', _env.error.format())

    throw new Error('Invalid environment variables.')
}

export const env = _env.data;