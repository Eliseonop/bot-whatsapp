const { extraerComentario } = require('./comentarioImagen')
const { traducirEstado } = require('./traducirEstado')

// Función común para manejar la respuesta
function procesarConComentario (data) {
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

module.exports = { procesarConComentario }
