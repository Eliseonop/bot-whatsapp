const { credentials } = require('../utils/credential')
const axios = require('axios')
const URLAPI = process.env.APIURL_JIRA

async function getAllReports () {
  try {
    const response = await axios.post(
      URLAPI + '/request?requestStatus=OPEN_REQUESTS',
      {
        headers: {
          Authorization: 'Basic ' + credentials,
          'X-Atlassian-Token': 'no-check'
        }
      }
    )

    const data = await response.data

    return data
  } catch (error) {
    console.log('⚡☢☣⚡')
    console.log(error)
    return error
  }
}

module.exports = { getAllReports }
