import {Tooltip} from 'react-leaflet'
import { demographicData, theme } from '../../types/interface'

interface compProps{
    dataSet:demographicData['result']
    title:string
    themes:theme[]
    sqm?:string
    wards?:number
}

export default function CusToolTip({dataSet, title, themes,sqm,wards}:compProps) {
    const total = dataSet? dataSet.map(data => {return data.val}).reduce((total, current) => {return total + current},0):0
  return (
    <Tooltip sticky>
        <div className="flex flex-col">
            <h1 className='font-bold  text-[1.2rem] mb-2 flex items-center'>{title} <span className="mx-2 mt-1 font-light text-[0.8rem] after:absolute relative after:content-['2'] after:text-[0.5rem] after:right-[-10%] after:top-[-0.2rem]">{`${sqm}km`}</span></h1>
            <h3 className=''>Wards: {wards}</h3>
            {dataSet?dataSet.map((data, index) => {
                
                return(
                    <div key={`${index}data ${data.val}`} className='flex w-full my-2 min-w-[150px]'>
                        <p className='font-bold w-fit mr-2'>{data.id}</p>
                        <div className="left-0 relative bg-[rgba(0,0,0,0.25)] items-start text-white flex item justify-center w-[10vw] min-w-[150px]">
                            <div className='absolute left-0 h-full' style={{width:`${(data.val/total)*100}%`, backgroundColor:themes.filter(theme => {return theme.id == data.id})[0].high}}></div>
                            <p className='z-[20]'>{data.val}</p>
                        </div>
                    </div>
                )
            }):null}
        </div>
    </Tooltip>
  )
}
