import {useState} from 'react'
import { dataRow, spreadSheetData } from "../../types/interface";
import { generateReport } from "../../util/ExcelGenerator";


interface compProps{
    reportName:string
    data:spreadSheetData
}



export default function ReportGenerator({data, reportName}:compProps) {
    const [reportState, setReportState] = useState({
        ready:true,
        loading:false,
        error:false
    })
    

    const handleClick = async () => {
        setReportState({
            ready:false,
            loading:true,
            error:false
        })
        try {
            await generateReport(reportName, data)
        } catch (error) {
            setReportState({
                ready:true,
                loading:false,
                error:true
            })
        }
    }
  return (
    <p onClick={handleClick} className="bg-blue-600 flex-1 min-w-[150px] max-w-[200px] text-center duration-300 hover:bg-blue-800 cursor-pointer text-white px-5 h-fit py-2 mt-1 font-light hover:font-semibold tracking-wide text-[0.65rem] rounded-md">Generate Report</p>    
  )
}
