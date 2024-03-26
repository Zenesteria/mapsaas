import {createSlice} from '@reduxjs/toolkit'
import { demographicData } from '../types/interface'
import { RootState } from './store'

export type initialStateProps={
    key:string
    data:{
        order?:RootState['map']['order']
        name:string
        total:{
            voters:number,
            wards:number
            pollingUnits:number
        }
        sqm?:string
        senatorialDistricts?:string[]
        lgas?:string[]
        geozone?:string
        pollingData?:demographicData['result']
    }
    display:{
        active:boolean
    }
}

const initialState:initialStateProps = {
    key:'',
    data:{
        name:'',
        total:{
            voters:0,
            wards:0,
            pollingUnits:0
        }

    },
    display:{
        active:false
    }
}

const infoSlice = createSlice({
    name:'info',
    initialState,
    reducers:{
        setDataKey:(state, action) => {
            state.key = action.payload.key
        },
        displayInfo:(state) => {
            state.display.active = true
        },
        hideInfo:(state) => {
            state.display.active = false
        },
        toggleInfo:(state) => {
            state.display.active ? state.display.active = false : state.display.active = true
        },
        setData:(state, action) => {
            action.payload.name? state.data.name = action.payload.name : state.data.name
            action.payload.sqm? state.data.sqm = action.payload.sqm : state.data.sqm
            action.payload.geozone? state.data.geozone = action.payload.geozone : state.data.geozone
            
            // METRICS
            action.payload.total? state.data.total = action.payload.total : state.data.total
            
            // Polling Data
            action.payload.pollingData? state.data.pollingData = action.payload.pollingData : state.data.pollingData

        },
        resetData:(state) => {
            state.data.name = ''
            state.data.total = {
                voters:0,
                wards:0,
                pollingUnits:0
            }
        }
    }
});

export default infoSlice.reducer
export const {setDataKey, displayInfo, toggleInfo, setData, hideInfo, resetData} = infoSlice.actions