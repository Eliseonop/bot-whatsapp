const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
// const { obtenerUltimoComentario } = require('./utils/ultimoComentario')
const { extraerComentario } = require('./utils/comentarioImagen')
const { traducirEstado } = require('./utils/traducirEstado')

// Función común para manejar la respuesta
function procesarData (data) {
  // Obtenemos la información relevante de la respuesta
  const fechaCreacion = data.createdDate.friendly
  const titulo = data.requestFieldValues.find(
    field => field.fieldId === 'summary'
  ).value
  const descripcion = data.requestFieldValues.find(
    field => field.fieldId === 'description'
  ).value
  const estado = traducirEstado(data.currentStatus.status)

  // Filtramos los comentarios y procesamos el texto
  const comentarios = extraerComentario(data)

  // Creamos el objeto con la información procesada
  const objetoProcesado = {
    crate: fechaCreacion,
    title: titulo,
    description: descripcion,
    estado,
    comentarios
  }

  return objetoProcesado
}

async function handleResponse (ctx, flowDynamic, endFlow, state) {
  const elEstado = state.getMyState()
  if (elEstado.codigo) {
    const respuesta = await getReporteByCode(elEstado.codigo)

    console.log('data procesada', procesarData(respuesta))

    if (respuesta?.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }

    const dataProcesada = procesarData(respuesta)

    await flowDynamic('🧐 Buscando ultimo comentario...')

    // const cmt = await obtenerUltimoComentario(respuesta)
    const mensaje = dataProcesada.comentarios
      .map((element, i) => {
        return `${i + 1}. Autor: *${element.autor}*\nComentario: *${
          element.comentario
        }*`
      })
      .join('\n\n')
    console.log('mensaje ', mensaje)
    if (dataProcesada) {
      await flowDynamic(
        `*${dataProcesada.crate}*` +
          '\n' +
          `${dataProcesada.title}` +
          '\n' +
          `estado: *${dataProcesada.estado}* ` +
          '\n\n' +
          `${
            dataProcesada.comentarios.length > 0
              ? `*Ultimos Comentarios:* \n${mensaje}`
              : 'No hay mensajes'
          }`
      )

      return endFlow('Gracias por usar nuestros servicios')
    } else {
      await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
    }
  }
}

const patron = /^#VER AAC-(\d+)/
const verCodigoFlow = addKeyword(`${patron}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')
    console.log(arrayDePalabras[1])
    state.update({
      codigo: arrayDePalabras[1]
    })

    const usuario = verificarNumeroEnArray(+ctx.from)
    if (usuario !== null) {
      console.log('el usuario si tiene permisos ')
      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    } else {
      await flowDynamic('🤨 El Usuario no tiene permisos')
      return endFlow('Adios')
    }
  })
  .addAnswer(
    '🔎 Buscando reporte...',
    null,
    async (ctx, { state, flowDynamic, endFlow }) => {
      await handleResponse(ctx, flowDynamic, endFlow, state)
    }
  )

module.exports = { verCodigoFlow }
