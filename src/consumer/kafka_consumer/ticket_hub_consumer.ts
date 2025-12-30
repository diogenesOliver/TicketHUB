import { KafkaInstance } from "../../lib/kafka";

export async function ticketHubConsumer(){
    const consumer  = KafkaInstance.consumer({ groupId: "ticketHub-group" })

    try{
        await consumer.connect()
        await consumer.subscribe({ topic: "ticket-hub", fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat }) => {
                const convertBufferMessageToString = message.value?.toString('utf-8') as string
                const convertStringMessageToJson = JSON.parse( convertBufferMessageToString )

                /* 
                    Aplicar lógica para enviar para todos os colaboradores do time de T.I
                */

                console.log( convertStringMessageToJson )

                await heartbeat() 
            }
        })

    }catch(e){
        console.error(`ERRO - Erro ao consumir as mensagens do Kafka: ${e}`)
    }
}