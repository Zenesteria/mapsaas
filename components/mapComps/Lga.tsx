import { useState, useEffect } from 'react'
import {Polygon, useMap, Tooltip} from 'react-leaflet'
import {useDispatch, useSelector} from 'react-redux'
import { displayInfo, hideInfo, setData } from '../../redux/infoSlice'
import { resetActive, setActive } from '../../redux/mapSlice'
import { RootState } from '../../redux/store'
import { demographicData } from '../../types/interface'
import getColor from '../../util/getColor'
import { dataThemes } from '../../util/dataThemes'
import CusToolTip from './CusToolTip'

interface compProps{
    coordinates:any
    name:string[]
    dataSet:demographicData
}

export default function PolygonShape({coordinates,name, dataSet}:compProps) {
    const dispatch = useDispatch();
    const mapState = useSelector((state:RootState) => {return state.map})
    const [state, setState] = useState({
        fill:''
    })
    
    useEffect(() => {
        const datasetCopy = {...dataSet}
        if(state.fill != getColor(datasetCopy.result, dataThemes)){
            const colorVal = getColor(datasetCopy.result, dataThemes)
            setState((prev) => {
                return {fill:colorVal}
            })
        }
        // console.log(datasetCopy.result)
    },[dataSet, state] )
    
    
    

    const map = useMap()
  return (
    <div>
        <Polygon
            className={name.join(" ")}
            pathOptions={{
                fillColor:state.fill,
                fillOpacity:1,
                weight:2,
                opacity:1,
                color:'white'
            }}
            positions={coordinates}
            eventHandlers={
                {
                    mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({
                            fillOpacity:0.7,
                        })
                    },
                    mouseout:   (e) => {
                        const layer = e.target;
                        layer.setStyle({
                            fillOpacity:1,
                        })
                    },
                    click: (e) => {
                        const layer = e.target;
                        dispatch(resetActive())
                        dispatch(setActive({
                            lga:name[1],
                        }))
                        dispatch(hideInfo())
                        dispatch(setData({
                            name:name[1],
                            total:{
                                voters:0,
                                wards:dataSet?.wards,
                                pollingUnits:dataSet?.units
                            },
                            pollingData:dataSet.result
                        }))

                        map.fitBounds(layer.getBounds())
                    }
                }
            }
        >
            {/* <Tooltip className='' sticky><h1 className='font-bold m-3 text-[1.2rem]'>{name[1]}</h1></Tooltip> */}
            <CusToolTip
                title={name[1]}
                themes={dataThemes}
                dataSet={dataSet?.result}
                wards={dataSet?.wards}
            />
        </Polygon>
    </div>
  )
}
