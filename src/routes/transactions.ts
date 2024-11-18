import { FastifyInstance } from "fastify"
import { knex } from "../database"
import crypto from 'node:crypto'
import { z } from "zod"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"


export async function transactionsRoutes(app: FastifyInstance) {

    app.get('/', {
        preHandler: [checkSessionIdExists]
    } ,async (req) => {

        const {sessionId} = req.cookies

        // Busca de dados
        const transactions = await knex('transactions').where('session_id', sessionId).select('*')
      
        return {
            transactions
        }
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists]
    } ,async (req) => {

        const getTransactionParamSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = getTransactionParamSchema.parse(req.params)
        const {sessionId} = req.cookies

        const transactions = await knex('transactions').where({
            id,
            session_id: sessionId
        }).first()

        return {
            transactions
        }
    })

    app.post('/', async (req, res) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let sessionId = req.cookies.sessionId;

        if(!sessionId){
            sessionId  = crypto.randomUUID()
            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge:  60 * 60 * 24 * 7, // 7 dias
            })
        }

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        })
            
        
        return res.status(201).send()

    })

    app.get('/summary', {
        preHandler: checkSessionIdExists
    } ,async (req) => {
        const {sessionId} = req.cookies

        const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'total'})
        .first()


        return {
            summary
        }
    })
}