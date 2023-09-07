const USUARIOS = [
  { name: 'Test Twilio', phone: 14155238886 },
  { name: 'Christian Quevedo', phone: 51986395011 },
  { name: 'Isaac Rivera', phone: 51967044833 },
  { name: 'Marty Inga', phone: 51944274641 },
  { name: 'Manuel Inga', phone: 51992554192 },
  { name: 'José Antón', phone: 51996848333 },
  { name: 'Mauro López', phone: 51933796895 },
  { name: 'Robert Robles', phone: 51969334755 },
  { name: 'Daniel Robles', phone: 51969334754 },
  { name: 'Joe Robles', phone: 51976331340 },
  { name: 'Pamela Reyes', phone: 51969334753 },
  { name: 'Sergio Villa', phone: 51920187967 }
]

function verificarNumeroEnArray (numero) {
  for (const usuario of USUARIOS) {
    if (usuario.phone === numero) {
      return usuario // Retorna el usuario encontrado
    }
  }
  return null // Retorna null si el número no existe en el array
}
module.exports = { USUARIOS, verificarNumeroEnArray }
