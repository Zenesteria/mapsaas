import { database } from "@/config/firebase/firebaseAdmin";
import { Candidate } from "@/types/Schemas/Candidate";
import { NextApiHandler } from "next";

const handler:NextApiHandler =async (req,res) => {
    const {method, query} = req
    const uid:string = `${query?.uid}`

    const Candidate:Candidate['documentData'] = req.body

    const docRef = database.collection('Users').doc(uid);


    const docData = await docRef.update(Candidate)

    res.status(201).json({msg:'Record Updated'})

}

export default handler