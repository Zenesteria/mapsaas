import { auth, database,} from "@/config/firebase/firebaseConfig";
import { Candidate } from "@/types/Schemas/Candidate";
import { PostingTitle } from "@/types/Schemas/PostingTitle";
import { server } from "@/util/Server";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  updatePhoneNumber,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { NextRouter } from "next/router";

export interface applicantParam {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  stateOfOrigin: string;
  lgaOfOrigin: string;
  gender: string;
  dob: string;
}

const CreateCandidate = async (data: applicantParam, router: NextRouter) => {
  let response = { msg: "", err: false };

  const credentials: Candidate["credentials"] = {
    email: data.email,
    password: data.password,
  };

  try {
    // await setPersistence(auth, browserSessionPersistence)

    const signUp = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    // await updateDoc(docRef, {
    //   img: downloadUrl,
    // });

    // document reference
    const docRef = doc(database, "Candidates", signUp.user.uid);
    const documentData: Candidate["documentData"] = {
      uid: `${signUp.user.uid}`,
      firstName: data.fname,
      lastName: data.lname,
      phoneNumber: {
        data: data.phoneNumber,
        verified: false,
      },
      address: data.address,
      email: {
        data: data.email,
        verified: false,
      },
      stateOfOrigin: data.stateOfOrigin,
      lgaOfOrigin: data.lgaOfOrigin,
      dateOfBirth: data.dob,
      gender: data.gender,
      role:'',
      guarantors: [],
    };

    const resData = await fetch(
      `${server}/api/applicant/createCandidateDocument`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          doc: documentData,
          uid: signUp.user.uid,
        }),
      }
    );

    // Send Email Verification
    await sendEmailVerification(signUp.user);

    // Captcha
    router.push(`/dashboard/${signUp.user.uid}`);
    return { msg: "signUp.user", err: false };
  } catch (error) {
    response.msg = `${error}`;
    console.log(error);
    response.err = true;
    throw new Error(response.msg);
  }
};

export const verifyMobileNumber = (data: string) => {
  let regexp =
    /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;
  let error;
  if (!regexp.test(data) || data.length !== 11) {
    error = "Invalid Phone Number";
  }
  return error;
};

export const verifyNIN = (data: string) => {
  let res = true;
  let error;
  // Verify Length
  if (data.length !== 11) {
    return (error = "Invalid NIN");
  }
};

export const verifyPassword = (data: string) => {
  let error;
  const regexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  return regexp.test(data)
    ? null
    : (error =
        "Password must be at least 8 characters with a capital character, at least a symbol and a numeral or more");
};

export const verifyEmail = (data: string) => {
  const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let error;
  if (!regexp.test(data)) {
    error = "Invalid Email Address";
  }
  return error;
};

export default CreateCandidate;
