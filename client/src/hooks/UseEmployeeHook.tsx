import axios from "axios";
import { useEffect, useState } from "react";

const UseEmployeeHook = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allEmployees, setAllEmployees] = useState<any[]>([]);

  const requestList = async () => {
    try {
      const request = await axios.get("http://localhost:8081/employees");
      const response = request.data;
      setAllEmployees(response);

      if (response.status !== "success") {
        console.log(response.messages);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestList();
  }, []);
  return { allEmployees };
};

export default UseEmployeeHook;
