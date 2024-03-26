import { RootState } from "../redux/store";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Authenticate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state: RootState) => {
    return state.user;
  });
  useEffect(() => {
    setIsAuthenticated(user.isLoggedIn);
  }, [user.isLoggedIn]);
  return (
    <div>
      {isAuthenticated ? children : <h1>You cannot view the resource</h1>}
    </div>
  );
}
