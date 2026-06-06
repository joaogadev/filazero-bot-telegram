import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function decideTool(
  message: string,
  state: any
) {

  const aiState = {

    currentStep:
      state.currentStep || null,

    selectedCompany:
      state.selectedCompany || null,

    selectedService:
      state.selectedService || null,

    selectedDate:
      state.selectedDate || null,

    selectedHour:
      state.selectedHour || null,

    availableServices:
      state.services?.map(
        (s: any) => s.name
      ) || [],

    availableDates:
      state.dates || []
  };

  const completion =
    await client.chat.completions.create({

      model:
        process.env.GROQ_MODEL ||
        "llama-3.1-8b-instant",

      temperature: 0,

      response_format: {
        type: "json_object"
      },

      messages: [

        {
          role: "system",
          content: `
        Você é o roteador de ferramentas da Filazero.

        Sua única função é escolher a próxima tool.

        Você SEMPRE deve analisar:

        - mensagem do usuário
        - estado atual da conversa

        TOOLS:

        list_companies
        get_company_services
        get_available_dates
        get_available_sessions
        get_booking_form
        schedule_appointment
        check_ticket_status
        list_my_tickets

        REGRAS:

        1) Se o usuário pedir empresas:
        -> list_companies

        2) Se o usuário mencionar uma empresa:
        -> get_company_services

        3) Se existir selectedCompany ou availableServices
        e o usuário mencionar um serviço:
        -> get_available_dates

        4) Se existir selectedService e o usuário mencionar:

        - uma data
        - amanhã
        - hoje
        - segunda
        - terça
        - quarta
        - quinta
        - sexta
        - sábado
        - domingo

        -> get_available_sessions

        Retorne também:

        {
          "date":"texto encontrado"
        }

        5) Se existir selectedDate e o usuário mencionar horário:

        Exemplos:

        14h
        14:00
        às 14
        as 14
        15h30

        -> schedule_appointment

        Retorne:

        {
          "hour":"valor encontrado"
        }

        6) Se existir selectedDate e selectedService
        e o usuário confirmar:

        "confirmar"
        "sim"
        "pode marcar"
        "agendar"

        -> schedule_appointment

        7) ticket:
        -> check_ticket_status

        8) meus tickets:
        -> list_my_tickets

        Exemplo:

        Estado:
        {
          "selectedCompany":"abacaxi-ltda",
          "selectedService":{
            "id":2701,
            "name":"BANHO E TOSA"
          }
        }

        Mensagem:
        "amanhã"

        Resposta:

        {
          "tool":"get_available_sessions",
          "arguments":{
            "date":"amanhã"
          }
        }

        Exemplo:

        Estado:
        {
          "selectedDate":"06/06/2026"
        }

        Mensagem:
        "14h"

        Resposta:

        {
          "tool":"schedule_appointment",
          "arguments":{
            "hour":"14:00"
          }
        }

        IMPORTANTE:

        Quando houver availableServices no estado,
        considere que qualquer texto parecido com um dos serviços
        é uma seleção de serviço.

        Exemplo:

        Estado:
        {
          "selectedCompany":"abacaxi-ltda",
          "availableServices":[
            "ATENDIMENTO",
            "BANHO E TOSA"
          ]
        }

        Mensagem:
        "banho e tosa"

        Resposta:

        {
          "tool":"get_available_dates",
          "arguments":{
            "service_name":"BANHO E TOSA"
          }
        }

        Responda SOMENTE JSON.
        `
        },

        {
          role: "user",
          content: JSON.stringify({
            message,
            state: aiState
          })
        }
      ]
    });

  return JSON.parse(
    completion.choices[0].message.content || "{}"
  );
}