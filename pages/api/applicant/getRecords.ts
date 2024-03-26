import { auth, database } from "@/config/firebase/firebaseAdmin"
import { NextApiHandler } from "next"


const GetRecords:NextApiHandler = async (req,res) => {
    const {uid} = req.body
    // Document Reference
    // const docRef = doc(database, 'Candidates', (uid));
    const docRef = database.collection('Users').doc(uid);


    try {
        // Fetch Data
        const document = await docRef.get();

        res.status(200).json(document.data());

        
    } catch (error) {
       res.status(500).json(error);
    }
}

export default GetRecords