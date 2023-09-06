const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getStatus } = require('../../services/getStatus')
const { obtenerUltimoComentario } = require('./utils/ultimoComentario')
const { extraerComentarioConImagen } = require('./utils/comentarioImagen')

const patron = /^#VER AAC-(\d+)/
const verCodigoFlow = addKeyword(`${patron}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const estado = state.getMyState()
    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')
    console.log(arrayDePalabras[1])
    state.update({
      codigo: arrayDePalabras[1]
    })
    if (estado === undefined) {
      const usuario = verificarNumeroEnArray(+ctx.from)
      if (usuario !== null) {
        console.log('el usuario si tiene permisos ')

        await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
      } else {
        await flowDynamic('🤨 El Usuario no tiene permisos')
        return endFlow('Adios')
      }
    }
  })
  .addAnswer(
    '🧐 Buscando ultimo comentario...',
    null,
    async (ctx, { state, flowDynamic, endFlow }) => {
      console.log('donde vamos a ir', ctx)
      const elEstado = state.getMyState()
      // console.log('el estado', elEstado)
      if (elEstado.codigo) {
        const respuesta = await getStatus(elEstado.codigo)

        if (respuesta?.errorMessage) {
          return endFlow('🙄 No se ha encontrado el Reporte')
        }

        console.log(respuesta)
        const cmt = await obtenerUltimoComentario(respuesta)

        const comentarioExtraido = extraerComentarioConImagen(cmt.comment)

        console.log('comentario extraido', comentarioExtraido)

        console.log(cmt)
        if (cmt) {
          // console.log(cmt)
          await flowDynamic([
            `*${cmt.user} ${cmt.fecha}*`,
            `comentario: *${comentarioExtraido}* `
          ])
          // if (cmt.imagen) {
          //   await flowDynamic({
          //     media: `${cmt.imagen}`
          //   })
          // }
        } else {
          await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
        }
      }
    }
  )

module.exports = { verCodigoFlow }
