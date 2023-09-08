const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')

const regAyuda = /^[Aa][Yy][Uu][Dd][Aa]$/
const mensaje =
    'Aquí tienes los comandos disponibles en este chat:\n\n' +

    'Para ir al menú principal, escribe: *MENU*\n' +
    'Para crear un nuevo reporte, escribe: *REPORTAR*\n' +
    'Para comentar un reporte, escribe : *COMENTAR [numero]*\n' +
    'Para ver todos los reportes abiertos, usa: *ABIERTOS*\n' +
    'Para los reportes cerrados, utiliza: *CERRADOS*\n' +
    'Para los reportes más recientes, escribe: *REPORTES*\n' +
    'Para ver un reporte específico, usa: *VER [número]*\n' +
    'Si tienes un código AAC específico, solicita el reporte con: *VER [numero]*\n' +
    'Ejemplo: Para ver el reporte de AAC-41 escriba *VER 41*\n\n' +

    'Notas:\nPara agilizar la carga enviamos un *máximo de 5 reportes*.\n' +
    'El *[número ]* es el número  que aparece en el *identificado*,\nEjemplo: de *AAC-14* su *[número ]* es *14*.\n' +

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
      return endFlow('Adiós')
    }
  })
  .addAnswer(mensaje)
module.exports = {
  ayudaFlujo
}
