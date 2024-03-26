import { MapContainer } from 'react-leaflet'
import {statesgeojson} from '../../config/statesgeojson'
import {lgageojson} from '../../config/lgageojson'
import States from './States'
import Lgas from './Lgas'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { demographicData } from '../../types/interface'





const center:any = [9.67475603288972, 7.287066434953559]

export default function Map({dataset,lgadataset}:{dataset:demographicData[],lgadataset:demographicData[]}) {
    const mapState = useSelector((state:RootState) => {return state.map})

  return (
    <MapContainer center={center}
        zoom={6}
        style={{width:'100%', height:'100%'}}
        attributionControl={false}
        zoomControl={false}
    >
        


        <States
            dataState={statesgeojson}
            dataset={dataset}
        />
        <Lgas
            dataLga={lgageojson}
            dataset={lgadataset}
        />
    </MapContainer>
  )
}

