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
const { reporteFlow } = require('./flows/createReport/reporteFlow')
const { estadoFlow } = require('./flows/consultaReporte/estatoFlow')
const { allReportesFlow } = require('./flows/allReportes/allReportesFlow')
const { createReportFlow } = require('./flows/createReport/createReportFlow')
const { verCodigoFlow } = require('./flows/consultaReporte/verCodigoFlow')
const { ayudaFlujo } = require('./flows/ayudaFlow')
const { allAbiertosFlow } = require('./flows/allReportes/allAbiertosFlow')
const { allCerradosFlow } = require('./flows/allReportes/allCerradosFlow')
const { comentarFlow, createComentFinal } = require('./flows/comentar/comentarFlow')
// const { temporalAttachment } = require('./services/tempAttachment')
// const { flujoImagen } = require('./flows/imagenFlow')

const flujoFin = addKeyword('FIN', {
  sensitive: true
}).addAnswer('Cancelando... , buen dia')

setInterval(() => {
  const fechaActual = new Date()
  const año = fechaActual.getFullYear()
  const mes = fechaActual.getMonth() + 1
  const dia = fechaActual.getDate()
  const hora = fechaActual.getHours()
  const minuto = fechaActual.getMinutes()
  const segundo = fechaActual.getSeconds()

  const horaImprimible = `${dia}/${mes}/${año} - ${hora}:${minuto}:${segundo}`
  console.log('Fecha Actual', horaImprimible)
}, 30000)

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([
    inicioFlow,
    reporteFlow,
    estadoFlow,
    createReportFlow,
    verCodigoFlow,
    allReportesFlow,
    flujoFin,
    ayudaFlujo,
    allAbiertosFlow,
    allCerradosFlow,
    comentarFlow,
    createComentFinal
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
