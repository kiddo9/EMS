import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ContextProps {
  children: React.ReactNode;
}

const Context = ({ children }: ContextProps) => {
  const nav = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") !== "loggedIn") {
      nav("/");
      return;
    }
  }, [nav]);
  return <div className="flex">{children}</div>;
};

export default Context;
