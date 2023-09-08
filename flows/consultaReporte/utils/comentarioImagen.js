function extraerComentario (data) {
  if (data.comments.values.length <= 0) return []
  const patronImagen = /!.*?\.(jpg|jpeg|png|gif)\|[^!]*!/g
  const comentarios = data.comments.values.map(comment => {
    const autor = comment.author.displayName
    const create = comment.created.friendly
    const comentario = comment.body
      .replace(patronImagen, '')
      .split('\n\n')[0]
      .trim()

    return { comentario, autor, create }
  })
  const listarComent = comentarios.filter(a => a.comentario !== '')
  console.log(listarComent)
  const cantidad = listarComent.length
  const resultado =
    cantidad >= 3
      ? listarComent.slice(-3)
      : cantidad === 2
        ? listarComent.slice(-2)
        : listarComent
  return resultado
}

module.exports = {
  extraerComentario
}
