const { addKeyword } = require('@bot-whatsapp/bot')
const { verifyUser } = require('../utils/verifyUser')

const regexAyuda = /^[Aa][Yy][Uu][Dd][Aa]$/
const mensaje =
    'Aquí tienes los comandos disponibles en este chat:\n\n' +

    'Para ir al menú principal, escribe: *MENU*\n' +
    'Para crear un nuevo reporte, escribe: *REPORTAR*\n' +
    'Para comentar un reporte, escribe : *COMENTAR [número]*\n' +
    'Para ver todos los reportes abiertos, usa: *ABIERTOS*\n' +
    'Para los reportes cerrados, utiliza: *CERRADOS*\n' +
    'Para los reportes más recientes, escribe: *REPORTES*\n' +
    // 'Para ver un reporte específico, usa: *VER [número]*\n' +
    'Si tienes un código AAC específico, solicita el reporte con: *VER [número]*\n\n' +
    // 'Ejemplo: Para ver el reporte de AAC-41 escriba *VER 41*\n\n' +

    '*Notas:*\nPara agilizar la carga enviamos un *máximo de 5 reportes*.\n' +
    'El *[número ]* es el número  que aparece en el *identificador*,\nEjemplo: de *AAC-14* su *[número]* es *14*.\n' +

    '😀 Gracias por usar nuestros servicios.'

const ayudaFlujo = addKeyword(`${regexAyuda}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic, true)
  })
  .addAnswer(mensaje)
module.exports = {
  ayudaFlujo, regexAyuda
}
