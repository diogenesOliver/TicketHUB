import { findQuerie } from "../../db/queries/find-querie"

import { z } from 'zod'
import { FastifyInstance } from 'fastify'

/* company id on url */
export const colaborators = async (app: FastifyInstance) => {
    app.get('/company/tickets/:id/v1', async (request, reply) => {
        try{

            const paramsValidation = z.object({ id: z.string().uuid() }) 
            const { id } = paramsValidation.parse(request.params)
            
            const tickets = await findQuerie("company", id, "collaborator", "Ticket")
            if(tickets == undefined){
                reply.status(404).send({
                    error: "[ERROR] - Error 404 on route /tickets/v1",
                    statusCode: 404
                })
                
                return
            }

            reply.status(200).send({
                data: tickets,
                statusCode: 200
            })
        
        }catch(e){
            console.error(`[ROUTE - /tickets/v1] - ${e}`)
        }
    })
}
