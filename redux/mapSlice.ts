import {createSlice} from '@reduxjs/toolkit'

export type initialStateProps={
    active:{
        state:string
        lga:string
        zone:'North-Central'|'North-East'|'North-West'|'South-East'|'South-South'|'South-West'
    },
    order:'state'|'senatorial'|'federal'|'geo-political-zone'
    activeBounds:[]
}

const initialState:initialStateProps = {
    active:{
        state:'',
        lga:'',
        zone:'North-Central'
    },
    order:'state',
    activeBounds:[]
}

const mapSlice = createSlice({
    name:'map',
    initialState,
    reducers:{
        setActive:(state, action) => {
            state.active.state = action.payload.state?action.payload.state:state.active.state
            state.active.lga = action.payload.lga?action.payload.lga:state.active.lga
            state.active.zone = action.payload.zone?action.payload.zone:state.active.zone
            state.activeBounds = action.payload.bound?action.payload.bound:state.activeBounds
        },
        setOrder:(state, action) => {
            state.order = action.payload.order
        },
        resetActive:(state) => {
            state.active = {
                state:state.active.state,
                lga:'',
                zone:state.active.zone
            }
        },
        fullReset:(state) => {
            state.active = {
                state:'',
                lga:'',
                zone:state.active.zone
            }
        }
    }
});

export default mapSlice.reducer
export const {setActive, setOrder,resetActive, fullReset} = mapSlice.actions