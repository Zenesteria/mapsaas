
import {statesgeojson} from './statesgeojson'
import {lgageojson} from './lgageojson'

export const statesdata = statesgeojson.features.map((state) => {
    return {
      name:state.properties.admin1Name,
      loc:state.geometry.coordinates[0].map((item:any) => {
        return [item[1], item[0]]
      }),
      LGAs:lgageojson.features.filter((lga) => {return lga.properties.admin1Name == state.properties.admin1Name}).map((lga) => {return lga.properties.admin2Name}),
      senatorialDistricts:state.properties.senatorialDistricts,
      federalConstituencies:state.properties.federalConstituencies.map((fed) => {
          return{
            name:fed.name,
            lgas:lgageojson.features.filter((lga) => {return lga.properties.admin4Name == fed.name}).map((lga) => {
                return lga.properties.admin2Name
            })
          }
      })
    }
})


