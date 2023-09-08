const { addKeyword } = require('@bot-whatsapp/bot')
const { verifyUser } = require('../utils/verifyUser')

const regexAyuda = /^[Aa][Yy][Uu][Dd][Aa]$/
const mensaje =
    'Aquí tienes los comandos disponibles en este chat:\n\n' +

    'Ir al menú principal: *MENU*\n' +
    'Crear un nuevo reporte: *REPORTAR*\n' +
    'Comentar un reporte : *COMENTAR [número]*\n' +
    'Ver todos los reportes abiertos: *ABIERTOS*\n' +
    'Ver los reportes cerrados: *CERRADOS*\n' +
    'Ver los reportes más recientes: *REPORTES*\n' +
    // 'Para ver un reporte específico, usa: *VER [número]*\n' +
    'Ver últimos comentarios de un reporte: *VER [número]*\n\n' +
    // 'Ejemplo: Para ver el reporte de AAC-41 escriba *VER 41*\n\n' +

    '*Notas:*\nPara agilizar la carga enviamos un *máximo de 5 reportes*.\n' +
    'El *[número]* es el número  que aparece en el *identificador*,\nEjemplo: de *AAC-14* su *[número]* es *14*.\n' +

    '😀 Gracias por usar nuestros servicios.'

const ayudaFlujo = addKeyword(`${regexAyuda}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic, state, true)
  })
  .addAnswer(mensaje)
module.exports = {
  ayudaFlujo, regexAyuda
}
