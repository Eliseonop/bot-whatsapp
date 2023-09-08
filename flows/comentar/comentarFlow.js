const { addKeyword } = require('@bot-whatsapp/bot')
// const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { procesarConComentario } = require('../consultaReporte/utils/procesarConComentario')
const { postComment } = require('../../services/postComment')
const { verifyUser } = require('../../utils/verifyUser')

const regexComentar = /^[Cc][Oo][Mm][Ee][Nn][Tt][Aa][Rr] (\d+)/
// const regexNumero = /^\d+$/
const comentarFlow = addKeyword(`${regexComentar}`, {
  regex: true
})
  . addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic, state, true)
  })
  . addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    // console.log('soy el ctx', ctx)

    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')
    const miState = state.getMyState()

    state.update({
      ...miState,
      etiqueta: arrayDePalabras[1]
    })

    const miState2 = state.getMyState()
    console.log('soy el miState2', miState2)

    const respuesta = await getReporteByCode(arrayDePalabras[1])

    if (respuesta.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }

    const dataProcesada = procesarConComentario(respuesta)

    if (dataProcesada) {
      await flowDynamic('🧐 Este es el *Reporte* al cual agregarás un *comentario*...')
      await flowDynamic(`${dataProcesada}`)
    } else {
      await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
    }
  }).addAnswer(['❌ Escribe *CANCELAR* para *salir*.', '✍ Dime tu comentario, Por favor'], { capture: true }, async (ctx, { flowDynamic, endFlow, state, fallBack }) => {
    const { etiqueta, usuario } = state.getMyState()

    console.log('etiqueta', etiqueta, usuario)
    if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
      return endFlow('😀 Vuelve pronto.')
    }
    if (regexComentar.test(ctx.body)) {
      return fallBack('🤔 No me envies el comando, intentalo de nuevo.')
    }
    //   console.log('comentario', ctx.body)
    const comentario = `(${usuario}) - ${ctx.body}`
    const crearComentario = await postComment(comentario, etiqueta)
    if (crearComentario?.errorMessage) {
      return endFlow('😱 Error, El Reporte no ha sido encontrado.')
    }
    console.log('respuesta', crearComentario)
    if (crearComentario.id) {
      await flowDynamic(['✔ Comentario agregado correctamente', `Escribe *VER ${etiqueta} para ver los comentarios`])
    }

    return endFlow('Gracias por usar nuestros servicios.')
  })

module.exports = { comentarFlow, regexComentar }
