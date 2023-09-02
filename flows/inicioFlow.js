const { addKeyword } = require('@bot-whatsapp/bot')

const inicioFlow = addKeyword('tcontur', {
  sensitive: true
}).addAnswer(
  [
    '🙌 Sistema de reportes de Errores de Tcontur 🙌',
    '🧐* Verificando numero...*'
  ],
  {
    delay: 2500
  },
  async (ctx, { flowDynamic, state }) => {
    switch (ctx.from) {
      case '1':
        console.log('soy la opcion 1')
        break

      case '2':
        console.log(' soy la opcion 2')
        break
      default:
        break
    }
  }
)

module.exports = {
  inicioFlow
}
