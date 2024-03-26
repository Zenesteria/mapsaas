import {configureStore} from '@reduxjs/toolkit'
import infoSlice from './infoSlice';
import mapSlice from './mapSlice'
import userSlice from './userSlice';

const store = configureStore({
    reducer:{
        map:mapSlice,
        info:infoSlice,
        user:userSlice
    },
    
});

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch