const { credentials } = require('../utils/credential')
const axios = require('axios')
const URLAPI = process.env.APIURL_JIRA

async function getAllReports (status = 'ALL_REQUESTS', limit = 5) {
  const newUrl =
    URLAPI +
    `/request?requestStatus=${status}` +
    `${limit ? '&limit=' + limit : ''}`
  console.log('😎😋😋😊😎😎', newUrl)
  try {
    const response = await axios.get(newUrl, {
      headers: {
        Authorization: 'Basic ' + credentials,
        Accept: 'application/json',
        'X-Atlassian-Token': 'no-check'
      }
    })

    const data = await response.data

    return data
  } catch (error) {
    console.log('⚡☢☣⚡')
    console.log(error)
    return error.response.data
  }
}

module.exports = { getAllReports }
