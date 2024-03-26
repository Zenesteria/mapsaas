import { app, database, storage } from "@/config/firebase/firebaseAdmin";
import { Candidate } from "@/types/Schemas/Candidate";
import { NextApiHandler } from "next";
import { uuidv4 } from "@firebase/util";
import {getStorage} from 'firebase-admin/storage'

const handler:NextApiHandler =async (req,res) => {
    const {doc, uid} = req.body

    try {
        

        const docRef =  database.collection("Users");

        await docRef.doc(uid).set(doc);
        res.status(201).json({ msg: "Record Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
}

export default handler