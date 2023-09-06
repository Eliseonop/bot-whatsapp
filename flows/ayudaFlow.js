const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')

const regAyuda = /^#AYUDA$/
const mensaje =
  'A continuación te brindaré los *comandos* que puedes usar en este chat:\n\n' +
  'Para navegar por el menú principal, simplemente escribe:\n*TCONTUR*\n\n' +
  'Si necesitas obtener todos los reportes disponibles, puedes usar: *#REPORTES*\n\n' +
  'Si deseas ver un reporte en particular, solo escribe:\n*#VER*\n\n' +
  'Si tienes un código *AAC* específico en mente, puedes solicitar el reporte automáticamente con:\n*#VER AAC-"numero"*\n\n' +
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
