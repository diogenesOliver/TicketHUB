import fastify, { FastifyInstance } from "fastify";

import { openSupportTicket } from './use_cases/collaborator-features/open-support-ticket'

import { colaborators } from './use_cases/company-features/collaborators'
import { companyRegistration } from "./use_cases/company-features/company-registration"
import { associatedCollaborator } from "./use_cases/company-features/associate-collaborator"
import { companyTokenValidation } from "./use_cases/company-features/token-validation";
import { companyLogin } from "./use_cases/company-features/comapny-login";

const app: FastifyInstance = fastify()

app.register(
    import("@fastify/formbody")
)

app.register(openSupportTicket)

app.register(colaborators)
app.register(companyRegistration)
app.register(associatedCollaborator)
app.register(companyTokenValidation)
app.register(companyLogin)

export = app