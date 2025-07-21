import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Refresher = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const path = searchParams.get("path"); // 🔍 get the value of the "path" query

  useEffect(() => {
    if (path) {
      nav(path); // navigate to the value of the "path" query
    }
  }, [path, nav]);
  return <></>;
};

export default Refresher;
