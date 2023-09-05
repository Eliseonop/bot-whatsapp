const {
  createBot,
  createProvider,
  createFlow,
  addKeyword
} = require('@bot-whatsapp/bot')
require('dotenv').config()
// const { writeFileSync, readFileSync } = require('fs')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { inicioFlow } = require('./flows/inicioFlow')
const { reporteFlow } = require('./flows/reporteFlow')
const { estadoFlow } = require('./flows/consultaReporte/estatoFlow')
const { allReportesFlow } = require('./flows/allReportesFlow')
const { createReportFlow } = require('./flows/createReportFlow')
const { verCodigoFlow } = require('./flows/consultaReporte/verCodigoFlow')
// const { temporalAttachment } = require('./services/tempAttachment')
// const { flujoImagen } = require('./flows/imagenFlow')

const flujoFin = addKeyword('FIN', {
  sensitive: true
}).addAnswer('Cancelando... , buen dia')

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([
    inicioFlow,
    reporteFlow,
    estadoFlow,
    createReportFlow,
    verCodigoFlow,
    allReportesFlow,
    flujoFin
  ])
  const adapterProvider = createProvider(BaileysProvider)

  createBot(
    {
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB
    },
    {
      queue: {
        timeout: 180000,
        concurrencyLimit: 15
      }
    }
  )

  QRPortalWeb()
}

main()
