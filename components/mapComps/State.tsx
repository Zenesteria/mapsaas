import { useCallback, useEffect, useState } from 'react'
import {Polygon, useMap, Tooltip} from 'react-leaflet'
import {useDispatch, useSelector} from 'react-redux'
import { displayInfo, setData} from '../../redux/infoSlice'
import { resetActive, setActive } from '../../redux/mapSlice'
import { RootState } from '../../redux/store'
import { demographicData } from '../../types/interface'
import { dataThemes } from '../../util/dataThemes'

import getColor from '../../util/getColor'
import CusToolTip from './CusToolTip'

interface compProps{
    coordinates:any
    name:string[]
    dataSet:demographicData
    sqm:string
}

export default function PolygonShape({coordinates,name, dataSet,sqm}:compProps) {
    const dispatch = useDispatch();
    const colorVal = getColor(dataSet.result, dataThemes)
    
    
    
    const mapState = useSelector((state:RootState) => {return state.map})
    const [state, setState] = useState({
        display:true,
        fill:colorVal,
    })

    const map = useMap()
    useEffect(() => {
    //    console.log(dataSet)
        if(document.getElementsByClassName(name[0])[0] != document.getElementsByClassName(mapState.active.state)[0]){    
            
            if(mapState.order == 'state'){
                setState((prev) => {
                    return {
                        display:true,
                        fill:colorVal,
                    }
                })
            }else{
                setState((prev) => {
                    return {
                      display: true,
                      fill: "#233064",
                    };
                })
            }

            if(mapState.order == 'geo-political-zone'){
                setState((prev) => {
                    return {
                        display:true,
                        fill:colorVal,
                    }
                })
            }


        }

        else{
            if(mapState.activeBounds.length > 0){
                const bounds:any = mapState.activeBounds
                map.fitBounds(bounds)
            }
            if(mapState.order != 'senatorial' && mapState.order != 'federal'){
                setState((prev) => {
                    return {
                      display: true,
                      fill:
                        mapState.order == "geo-political-zone"
                          ? prev.fill
                          : "#233064",
                    };
                })
            }else{
                console.log('GONE')
                setState((prev) => {
                    return{
                        display:false,
                        fill:prev.fill
                    }
                })
            }
        }



        
    },[colorVal,mapState.active.state,mapState.order,name,mapState.activeBounds,map])
  return (
    <>
        
        <Polygon
            className={`${name.join(" ")}`}
            pathOptions={{
                fillColor:state.fill,
                fillOpacity:0.7,
                weight:2,
                opacity:1,
                color:'white'
            }}
            positions={state.display?coordinates:[]}
            eventHandlers={
                {
                    mouseover: (e) => {
                        const layer = e.target;

                        layer.setStyle({
                            fillOpacity:1
                        })
                    },

                    mouseout:   (e) => {
                        const layer = e.target;
                        layer.setStyle({
                            fillOpacity:0.7
                        })
                    },

                    click: (e) => {
                        const layer = e.target;
                        if(mapState.order != 'state'){
                            setState((prev) => {
                                return{
                                    display:false,
                                    fill:prev.fill,
                                }
                            })
                        }
                        dispatch(resetActive())
                        dispatch(setActive({
                            state:name[0],
                            bound:coordinates
                        }))

                        // TOGGLE DISPLAY
                        dispatch(displayInfo())

                        dispatch(setData({
                            name:name[0],
                            sqm,
                            geozone:name[1],
                            total:{
                                voters:0,
                                wards:dataSet.wards,
                                pollingUnits:dataSet.units
                            },
                            pollingData:dataSet.result
                        }))
                        map.fitBounds(layer.getBounds())
                    }
                }
            }
        >
            <CusToolTip
                title={name[0]}
                themes={dataThemes}
                dataSet={dataSet.result}
                sqm={sqm}
                wards={dataSet.wards}
            />
        </Polygon>
    </>
  )
}
