import { demographicData, theme } from "../types/interface"
import { themeType } from "./dataThemes"

interface funcArgs{
    result:demographicData['result']
    themes:themeType
}




const getColor = (result:funcArgs['result'], themes:funcArgs['themes']):string => {
    let highest = {
        id:'Default',
        val:0
    } 
    
    
    if(result){
        let minDiff = result[0].val
        result.map((data) => {
            const diff = Math.abs(data.val - highest.val)
            highest = data.val > highest.val ? data : highest
    
            minDiff = diff < minDiff ? diff : minDiff
        })

       
    
        const colorData = themes.filter(theme => {return theme.id == highest.id})[0]
        // console.log(highest)
        let color = 'none'
    
        if(minDiff <= 200){
            return colorData.low
        }
    
       if(minDiff > 200 && minDiff <= 700){
            return colorData.mid
        }
    
       else if(minDiff > 700){
            return colorData.high
        }
    
       else if(minDiff == 0){
            return "#446ab3";
        }
        // return 'red'
    }

    return "#446ab3";
    
}

export default getColor