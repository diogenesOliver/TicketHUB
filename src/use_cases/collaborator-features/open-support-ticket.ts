import { insertQuerie } from "../../db/queries/insert-querie";
import { Domain_Ticket_Data } from "../../domain/ApplicationDomainLayer";
import { KafkaInstance } from "../../lib/kafka";
import { ticketHubConsumer } from "../../consumer/kafka_consumer/ticket_hub_consumer";

import { FastifyInstance } from "fastify";
import { z } from 'zod'

/* colaborator id on url */
export async function openSupportTicket(app: FastifyInstance) {
    app.post('/open/ticket/:id/v1', async (request, reply) => {
        try{
            const producer = KafkaInstance.producer()
            await producer.connect()

            const ticketDataValidation = z.object(Domain_Ticket_Data)
            const ticketData = ticketDataValidation.parse(request.body)

            const paramsValidation = z.object({ id: z.string().uuid() })
            const { id } = paramsValidation.parse(request.params)

            const querie = await insertQuerie("ticket", ticketData, "collaborator", id)
            if(querie == undefined){
                reply.status(500).send({
                    error: "Internal error on server! Try again for a few minutes",
                    statusCode: 500
                })

                return
            }

            await producer.send({
                topic: "ticket-hub",
                messages: [
                    {
                        value: JSON.stringify(ticketData)
                    }
                ]
            })

            await producer.disconnect()
            ticketHubConsumer()

            reply.status(201).send({
                message: "[INFO] - Ticket created successfully",
                statusCode: 201
            })
        }catch(e){
            console.error(`[ROUTE - /open/ticket/v1] - ${e}`)
        }
    })
}