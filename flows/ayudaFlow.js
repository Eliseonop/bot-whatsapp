const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')

const regAyuda = /^#AYUDA$/
const mensaje =
  'Aquí tienes los comandos disponibles en este chat:\n\n' +
  'Para ir al menú principal, escribe: *TCONTUR*\n\n' +
  'Para crear un nuevo reporte, escribe: *#REPORTAR*\n\n' +
  'Nota: Para agilizar la carga enviamos un *máximo de 10 reportes*.\n\n' +
  'Para ver todos los reportes abiertos, usa: *#ABIERTOS*\n\n' +
  'Para los reportes cerrados, utiliza: *#CERRADOS*\n\n' +
  'Para los reportes más recientes, escribe: *#REPORTES*\n\n' +
  'Para ver un reporte específico, usa: *#VER*\n\n' +
  'Si tienes un código AAC específico, solicita el reporte con: *#VER AAC-"numero"*\n\n' +
  '😀 Gracias por usar nuestros servicios.'

const ayudaFlujo = addKeyword(`${regAyuda}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const usuario = verificarNumeroEnArray(+ctx.from)
    if (usuario !== null) {
      console.log('el usuario si tiene permisos ')

      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    } else {
      await flowDynamic('🤨 El Usuario no tiene permisos')
      return endFlow('Adios')
    }
  })
  .addAnswer(mensaje)
module.exports = {
  ayudaFlujo
}
