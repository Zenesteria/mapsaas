import { auth } from "@/config/firebase/firebaseAdmin";
import { User } from "firebase/auth";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const usersCont:any = [];
    console.log(usersCont)

    const listAllUsers = async (nextPageToken?:string) => {
      // List batch of users, 1000 at a time.
      const allUsers = await auth.listUsers(1000,nextPageToken);
      if (allUsers.pageToken) {
        console.log(usersCont);
        // List next batch of users.
        listAllUsers(allUsers.pageToken);
      }
      return allUsers.users
    //   auth
    //     .listUsers(1000, nextPageToken)
    //     .then((listUsersResult) => {
    //         // console.log(listUsersResult.users)
    //       listUsersResult.users.forEach((userRecord) => {
    //         // console.log("user", userRecord.toJSON());
    //         // console.log(userRecord.uid)

    //         usersCont.push({
    //             uid:userRecord.uid,
    //             email:`${userRecord.email}`
    //         })
    //       });
    //       if (listUsersResult.pageToken) {
    //         console.log(usersCont)
    //         // List next batch of users.
    //         listAllUsers(listUsersResult.pageToken);
    //       }
    //       res.status(200).json({ usersCont });
    //     })
    //     .catch((error) => {
    //       console.log("Error listing users:", error);
    //     });
    };
    // Start listing users from the beginning, 1000 at a time.
    const data = await listAllUsers();
    
    res.status(200).json(data)
    // console.log(usersCont)


    
};

export default handler;
