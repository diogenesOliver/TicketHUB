import { findQuerie, findCoorporateTokenFromValidationFeature } from "../../db/queries/find-querie"

import { FastifyInstance } from "fastify"

export async function companyLogin(app: FastifyInstance){
    app.post('/company/login/v1', async (request, reply) => {
        try{
            const tokenFromLogin = request.body
            //@ts-ignore
            const tokenValidation = await findCoorporateTokenFromValidationFeature('company', tokenFromLogin?.token)

            const coorporateFirstAccessStatus: boolean = tokenValidation?.message?.companyData.corporate_first_access
            if(coorporateFirstAccessStatus == false)
                return reply.status(400).send({ message: "Token not validated! Login invalid", statusCode: 404 })

            if(tokenValidation?.querieStatus == false)
                return reply.status(400).send({ message: "Invalid company token", statusCode: 404 })

            return reply.status(201).send({
                message: "Successfully login company!",
                statusCode: 201,
            })
        }catch(e){
            
        }

    })
}