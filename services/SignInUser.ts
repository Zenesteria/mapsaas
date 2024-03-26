import { auth } from "@/config//firebase/firebaseConfig";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { NextRouter } from "next/router";

const SignInCandidate = async (
  email: string,
  password: string,
  router: NextRouter
) => {
  // Sign In User
  try {
    await setPersistence(auth, browserSessionPersistence);
    const SignIn = await signInWithEmailAndPassword(auth, email, password);
    // Redirect
    router.push(`/PollingForm`);
  } catch (error: any) {
    // console.log(error.code)
    throw new Error(`${error?.code}`);
  }
};

export default SignInCandidate;
