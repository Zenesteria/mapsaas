import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { auth, app } from "@/config/firebase/firebaseConfig";
import { createUser, signOutUser } from "@/redux/userSlice";

export default function MainApp({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => {
    return state.user;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      let userSessionTimeOut = null;

      if (userData == null && userSessionTimeOut) {
        clearTimeout(userSessionTimeOut);
        userSessionTimeOut = null;
      } else {
        if (userData) {
          // console.log(user)
          dispatch(
            createUser({
              email: userData.email,
              uid: userData.uid,
              displayName: userData.displayName,
            })
          );
        }
        userData?.getIdTokenResult().then((idTokenResult) => {
          const authtime =
            Number.parseInt(idTokenResult.claims.auth_time || "0") * 1000;
          const sessionDuration = 30 * 60 * 1000;
          const expirationInMilliseconds =
            sessionDuration - (Date.now() - authtime);
          userSessionTimeOut = setTimeout(() => {
            signOut(auth);
            dispatch(signOutUser());
          }, expirationInMilliseconds);
        });
      }

      if (userData) {
        // console.log(user)
        dispatch(
          createUser({
            email: userData.email,
            uid: userData.uid,
            displayName: userData.displayName,
          })
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  return <div className="relative">{loading ? null : children}</div>;
}
