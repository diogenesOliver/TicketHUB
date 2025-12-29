import { findCoorporateTokenFromValidationFeature } from "../../db/queries/find-querie"
import { updateQuerie } from "../../db/queries/update-querie"

import { FastifyInstance } from "fastify"

export const companyTokenValidation = async (app: FastifyInstance) => {
    app.post('/token/validation', async (request, reply) => {
        try{
            const tokenRequired = request.body
            
            // @ts-ignore
            const findToken = await findCoorporateTokenFromValidationFeature("company", tokenRequired?.token)
            
            if (findToken?.querieStatus == false)
                return reply.status(400).send({ message: "Invalid company token", statusCode: 400 })

            if (findToken?.message?.companyData.corporate_first_access == true)
                return reply.status(404).send({ message: "Company token already validated", statusCode: 404 })

            updateQuerie("company", findToken?.message?.companyData.id, "corporate_first_access", true)

            return reply.status(201).send({
                message: "Succesfully token validation",
                statusCode: 201,
                token: tokenRequired
            })
        }catch(e){
            console.log(`[ROUTE - /token/validation] - ${e}`)
        }
    })
}