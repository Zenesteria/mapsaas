import { auth } from "@/config/firebase/firebaseConfig";

export const isAdmin = () => {
    console.log(auth.currentUser?.email);
    return auth.currentUser?.email == "admin@jagaban.com";
}