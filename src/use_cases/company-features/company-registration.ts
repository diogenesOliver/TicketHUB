import { config } from "dotenv";
config()

import { Domain_Company_Data } from "../../domain/ApplicationDomainLayer"
import { insertQuerie } from "../../db/queries/insert-querie";
import { updateQuerie } from "../../db/queries/update-querie";
import { KafkaInstance } from "../../lib/kafka";
import { generateTokenConsumer, token } from "../../consumer/kafka_consumer/generate_token_consumer";

import { FastifyInstance } from "fastify";
import { z } from "zod"

export async function companyRegistration(app: FastifyInstance){
    app.post('/company/registration/v1', async (request, reply) => {
        const companyDataValidation = z.object(Domain_Company_Data)
        const companyData = companyDataValidation.parse(request.body)

        try {
            const producer = KafkaInstance.producer()
            await producer.connect()

            const registrationCoorporate = await insertQuerie("company", companyData)

            const jwtToken = token()
            //@ts-ignore
            await updateQuerie("company", registrationCoorporate?.id, "corporate_token", jwtToken)

            if (registrationCoorporate == undefined){
                reply.status(404).send({
                        message: {
                            string: "[ERROR] - Company email or CNPJ already registered",
                            statusCode: 404
                        }
                    })

                return
            }

            await producer.send({
                topic: "registration-event",
                messages: [
                    {
                        value: JSON.stringify(companyData.corporate_email as string)
                    }
                ]
            })

            await producer.disconnect()
            generateTokenConsumer()

            reply.status(200).send({
                message: `Validation TOKEN sended from company email: ${companyData.corporate_email as string}`,
                statusCode: 200
            })

        }catch(e){
            reply.status(500).send({
                error: `Internal error on server! Try again for a few minutes`,
                statusCode: 500
            })

            console.error(`[ROUTE - /company/registration/v1] - ${e}`)
        }
    })
}