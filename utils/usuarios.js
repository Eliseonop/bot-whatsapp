const USUARIOS = []

function verificarNumeroEnArray (numero) {
  for (const usuario of USUARIOS) {
    if (usuario.phone === numero) {
      return usuario // Retorna el usuario encontrado
    }
  }
  return null // Retorna null si el número no existe en el array
}
module.exports = { USUARIOS, verificarNumeroEnArray }
