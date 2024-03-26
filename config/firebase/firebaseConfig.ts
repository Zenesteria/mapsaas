import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_API_KEY,
  authDomain: process.env.NEXT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PROJECT_ID,
  storageBucket: process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_ID,
};

// const app = !getApps().length
//   ? initializeApp(firebaseConfig, "app")
//   : getApp("app");
const app = initializeApp(firebaseConfig, "app");

const database = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, database, auth, storage };
