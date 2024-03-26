import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as firebase from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const adminConfigOpts = {
  credential: firebase.credential.cert({
    projectId: process.env.NEXT_PROJECT_ID,
    clientEmail: process.env.NEXT_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  storageBucket: process.env.NEXT_STORAGE_BUCKET,
};

const app = !firebase.apps.length
  ? initializeApp(adminConfigOpts)
  : firebase.app();

const database = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, database, auth, storage };
