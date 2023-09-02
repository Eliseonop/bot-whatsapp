const {
  createBot,
  createProvider,
  createFlow,
  EVENTS,
  addKeyword
} = require('@bot-whatsapp/bot')
require('dotenv').config()
const { writeFileSync, readFileSync } = require('fs')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { inicioFlow } = require('./flows/inicioFlow')
const { reporteFlow } = require('./flows/reporteFlow')
const { estadoFlow } = require('./flows/estatoFlow')
const { uploadImageToJira } = require('./services/tempAttachment')
// async function bufferToFile (imageBuffer, fileType) {
//   // Genera un nombre de archivo único (puedes ajustarlo según tus necesidades)
//   const fileName = `imagen_${Date.now()}.${fileType}`

//   // Escribe el búfer en el sistema de archivos
//   writeFileSync(fileName, imageBuffer)

//   // Crea un objeto File a partir del archivo
//   console.log('leendo papay', [readFileSync(fileName)])
//   const file = new File([readFileSync(fileName)], fileName, {
//     type: `image/${fileType}`
//   })

//   return file
// }
const flujoImagen = addKeyword(EVENTS.MEDIA).addAnswer(
  ['hola'],
  null,
  async (ctx, { flowDynamic }) => {
    console.log('sou el ctx', ctx)
    if (ctx.message.imageMessage) {
      const buffer = await downloadMediaMessage(ctx, 'buffer')
      console.log('si hay imagen', buffer)
      const mimeType = ctx.message.imageMessage?.mimetype

      // const parts = mimeType.split('/')
      // const extension = parts[1]
      // const btf = await bufferToFile(buffer, extension)
      console.log('soy el mimetype 30', mimeType)
      // const readImage = await readFileSync(buffer)
      // console.log('soy el mimetype 123123123', readImage)

      const respustaImagenJira = await uploadImageToJira(buffer, mimeType)
      console.log('soy la respuesta')
      console.log(respustaImagenJira)
    } else {
      console.log('No es una imagen')
      await flowDynamic('No es una imagen')
    }

    // const formData = new FormData()

    // formData.append('file', readImage, {
    //   filename: 'file.jpeg', // El nombre que deseas para el archivo en el FormData
    //   contentType: 'image/jpeg' // El tipo de contenido de la imagen (puede variar según el formato)
    // })
    // console.log()
    // console.log('soy el buffer', buffer)
    // console.log(buffer)
    // writeFileSync('./file.jpeg', buffer)
  }
)

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([
    inicioFlow,
    reporteFlow,
    estadoFlow,
    flujoImagen
  ])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  QRPortalWeb()
}

main()
