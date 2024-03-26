
import { demographicData, pollingData } from "../types/interface";
// import { correctPu } from "./newPU";
import { statesdata } from "../config/dataScripts";
import { statesgeojson } from "../config/statesgeojson";
import { lgageojson } from "../config/lgageojson";
import { database } from "../config/firebase/firebaseConfig";
import {collection, getDoc, getDocs, QueryDocumentSnapshot} from 'firebase/firestore'

export const getStateDataSet = async ():Promise<Promise<demographicData>[]> => {
    
    const promises = statesdata.map(async (state) => {
        const colRef = collection(database, state.name)
        const statesres =  await getDocs(colRef)

        let firebasecols:pollingData['lgas'] = []

        statesres.forEach((doc:any) => {
            firebasecols.push(doc.data())
        })
        
        let resultCont:demographicData['result'] = firebasecols[0].wards[0].units[0].result.map((result) => {
            return {
                id:result.id,
                val:0
            }
        })

        let totalWards:number[] = [];
        let totalUnits:number[] = [];
        
        firebasecols.map((lga) => {
            totalWards.push(lga.wards.length)
            lga.wards.map((ward) => {
                totalUnits.push(ward.units.length)
                ward.units.map((unit) => {
                    unit.result.map((res) => {
                        resultCont = resultCont.map((rescont) => {
                            return {
                                id:resultCont.filter(ele => {return ele.id == rescont.id})[0].id,
                                val:res.id == rescont.id?resultCont.filter(ele => {return ele.id == rescont.id})[0].val + res.val:rescont.val
                            }
                        })
                    })
                })
            })
        })

        return {
            loc:state.name,
            wards:totalWards.reduce((total, current) => {return total + current}),
            units:totalUnits.reduce((total, current) => {return total + current}),
            result:resultCont,
            alldata:firebasecols
        }
    })
    const dataset:any = await Promise.all(promises)
    return dataset
    
}

export const getLgaDataSet = async ():Promise<demographicData[]> => {
    let resultlgacont:demographicData[] = []
    const promises = statesdata.map(async (state) => {

        const colRef = collection(database, state.name)
        const statesres =  await getDocs(colRef)
        let firebasecols:pollingData['lgas'] = []

        statesres.forEach((doc:any) => {
            firebasecols.push(doc.data())
        })
        
        
        firebasecols.map((lga) => {
            let totalWards:number = lga.wards.length
            let totalUnits:number[] = []
            let resultCont:demographicData['result'] = firebasecols[0].wards[0].units[0].result.map((result) => {
                return {
                    id:result.id,
                    val:0
                }
            })
            lga.wards.map((ward) => {
                totalUnits.push(ward.units.length)
                ward.units.map((unit) => {
                    unit.result.map((res) => {
                        resultCont = resultCont.map((rescont) => {
                            return {
                                id:resultCont.filter(ele => {return ele.id == rescont.id})[0].id,
                                val:res.id == rescont.id?resultCont.filter(ele => {return ele.id == rescont.id})[0].val + res.val:rescont.val
                            }
                        })
                    })
                })
            })

            resultlgacont.push({
                loc:lga.name,
                wards:totalWards,
                units:totalUnits.reduce((total, current) => {return total + current}),
                result:resultCont
            })
        })

        
    })
    await Promise.all(promises)
    return resultlgacont
}


// DEV MOCK

export const getStateDataSetDev = ():demographicData[] => {
    const result = statesgeojson.features.map((state) => {
        return {
            loc:state.properties.admin1Name,
            result:[{
                id:'APC',
                val:/*10000*/ Math.floor(Math.random()*1000)
            },
            {
                id:'PDP',
                val:/*1200*/ Math.floor(Math.random()*1000)
            }
        ]
        }
    })
    return result
}

export const getLgaDataSetDev = ():demographicData[] => {
    const result = lgageojson.features.map((state) => {
        return {
            loc:state.properties.admin2Name,
            result:[{
                id:'APC',
                val:/*10000*/ Math.floor(Math.random()*1000)
            },
            {
                id:'PDP',
                val:/*1200*/ Math.floor(Math.random()*1000)
            }
        ]
        }
    })
    return result
}

