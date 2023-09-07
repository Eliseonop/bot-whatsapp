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
  // console.log('soy comentarios', comentarios)
  let mensaje = 'No hay comentarios';
  if (comentarios) {
    const dataMensaje = comentarios.map((element, i) => {
      return `${i + 1}. *${element.create}* de *${
          element.autor
      }*\nComentario: *${element.comentario}*`
    })
        .join('\n\n')
    mensaje = `*Ultimos Comentarios:* \n${dataMensaje}`
  }
  // console.log('soy data', dataMensaje)


  // Creamos el objeto con la información procesada
  const objetoProcesado = {
    crate: fechaCreacion,
    title: titulo,
    description: descripcion,
    estado,
    mensaje
  }

  return `*${objetoProcesado.crate}*` +
  '\n\n' +
  `Encabezado: *${objetoProcesado.title}*` +
  '\n' +
  `Estado: *${objetoProcesado.estado}* ` +
  '\n\n' +
  `${objetoProcesado.mensaje}`;
}

module.exports = { procesarConComentario }
