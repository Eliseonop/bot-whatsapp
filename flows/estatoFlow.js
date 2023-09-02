const { addKeyword } = require('@bot-whatsapp/bot')

const estadoFlow = addKeyword('2', {
  sensitive: true
}).addAnswer(
  ['Dime el *IDENTIFICADOR* del reporte'],
  null,

  async (ctx, { endFlow }) => {}
)

module.exports = {
  estadoFlow
}
