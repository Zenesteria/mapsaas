import { doc,setDoc } from "firebase/firestore";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { database } from "../../config/firebase/firebaseConfig";
import { demographicData } from "../../types/interface";

export interface bodyProps {
  state: string;
  lga: string;
  pollingUnit: string;
  result: {
    id: string;
    val: number;
  }[];
  wards: {
    name: string;
    units: {
      id: string;
      name: string;
      result: {
        id: string;
        val: number;
      }[];
    }[];
  }[];
}

const handler:NextApiHandler = async (req:NextApiRequest,res:NextApiResponse) => {
    const {state, lga, wards,pollingUnit,result}:bodyProps = req.body
    const docRef = doc(database, state, lga);
    console.log("start", docRef);
    try {
        const pushLga = await setDoc(docRef, {
          name: lga,
          wards: wards.map((ward) => {
            return {
              name: ward.name,
              units: ward.units.map((unit) => {
                return unit.id == pollingUnit
                  ? {
                      id: unit.id,
                      name: unit.name,
                      result: result,
                    }
                  : {
                      id: unit.id,
                      name: unit.name,
                      result: unit.result,
                    };
              }),
            };
          }),
        });
        res.status(201).json({msg:'success'})
    } catch (error) {
        res.status(500).json({msg:error})
        console.log(error)
    }
    
}


export default handler