import writeXlsxFile from 'write-excel-file'
import { pollingData, spreadSheetData } from '../types/interface'

export const generateReport = async (fileName:string, data:any) => {
    await writeXlsxFile(data,{
        fileName
    })
}

export const generateReportData = (data:pollingData['lgas']):spreadSheetData => {
    const HEADER_ROW = [
        {
          value: 'LGA',
          fontWeight: 'bold'
        },
        {
          value: 'WARD',
          fontWeight: 'bold'
        },
        {
          value: 'POLLING UNIT NAME',
          fontWeight: 'bold'
        },
        {
          value: 'POLLING UNIT ID',
          fontWeight: 'bold'
        },
    ]

    const dataSheet:spreadSheetData = [
        HEADER_ROW,
    ]

    data.map((lga, index) => {
        lga.wards.map((ward) => {
            ward.units.map((unit) => {
                const rowData = [
                    {
                        type:String,
                        value:lga.name,
                    },
                    {
                        type:String,
                        value:ward.name,
                    },
                    {
                        type:String,
                        value:unit.name,
                    },
                    {
                        type:String,
                        value:unit.id,
                    },
                ]
                dataSheet.push(rowData)
            })
        })
    })
      
    return dataSheet
      
}