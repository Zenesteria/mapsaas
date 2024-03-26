export interface demographicData{
    loc:string
    wards?:number
    units?:number
    sqm?:number
    geozone?:string
    result:{
        id:string
        val:number
    }[]
    alldata?:pollingData['lgas']
}

export interface theme{
    id:string
    high:string
    mid:string
    low:string
    neutral:string
}


export interface pollingData{
    name: string;
    lgas: {
        name: string;
        wards:{
            name: string;
            units: {
                id: string,
                name:string
                result: {
                    id: string;
                    val: number;
                }[];
            }[];
        }[];
    }[];
}[]


// SPREADSHEET TYPE


export type dataRow = {
    type?:StringConstructor|NumberConstructor|BooleanConstructor|DateConstructor
    value:string|number|boolean|Date
    format?:string
    fontWeight?:string
}[]

export type spreadSheetData = dataRow[]


