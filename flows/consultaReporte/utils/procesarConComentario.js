const { extraerComentario } = require('./comentarioImagen')
const { traducirEstado } = require('./traducirEstado')

// Función común para manejar la respuesta
function procesarConComentario (data) {
  // Obtenemos la información relevante de la respuesta
  const fechaCreacion = data.createdDate.friendly.toUpperCase()
  const titulo = data.requestFieldValues.find(
    field => field.fieldId === 'summary'
  ).value
  const descripcion = data.requestFieldValues.find(
    field => field.fieldId === 'description'
  ).value
  const estado = traducirEstado(data.currentStatus.status)

  // Filtramos los comentarios y procesamos el texto
  const comentarios = extraerComentario(data)
  // console.log(comentarios)
  const dataMensaje = comentarios.map((element, i) => {
    return `${i + 1}. *${element.create}* \n *${element.comentario}*`
  })
    .join('\n\n')
  const mensaje = `${
    comentarios.length > 0
          ? `*Ultimos Comentarios:* \n${dataMensaje}`
          : 'No hay mensajes'
      }`

  const objetoProcesado = {
    crate: fechaCreacion,
    title: titulo,
    description: descripcion,
    estado,
    mensaje
  }

  return `*Creado ${objetoProcesado.crate}*` +
  '\n\n' +
  `Encabezado: *${objetoProcesado.title}*` +
  '\n' +
  `Estado: *${objetoProcesado.estado}* ` +
  '\n\n' +
  `${objetoProcesado.mensaje}`
}

module.exports = { procesarConComentario }
