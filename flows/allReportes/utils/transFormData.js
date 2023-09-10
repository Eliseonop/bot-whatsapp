function transformDataToReportsArray (data) {
  const reportsToShow = []

  data.values.forEach(report => {
    const reportToShow = {
      issueKey: report.issueKey,
      summary: report.requestFieldValues.find(
        field => field.fieldId === 'summary'
      ).value,
      createdDate: report.createdDate.friendly,
      currentStatus: report.currentStatus.status
    }

    if (
      report.requestFieldValues.find(field => field.fieldId === 'attachment')
        .value.length > 0
    ) {
      reportToShow.attachmentsCount = report.requestFieldValues.find(
        field => field.fieldId === 'attachment'
      ).value.length
    }

    reportsToShow.push(reportToShow)
  })

  return reportsToShow
}

module.exports = { transformDataToReportsArray }
