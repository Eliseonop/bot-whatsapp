const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
require('dotenv').config()
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { inicioFlow } = require('./flows/inicioFlow')
const { reporteFlow } = require('./flows/reporteFlow')
const { estadoFlow } = require('./flows/estatoFlow')

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([inicioFlow, reporteFlow, estadoFlow])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  QRPortalWeb()
}

main()
