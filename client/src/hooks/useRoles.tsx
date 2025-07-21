import axios from "axios";
import { useEffect, useState } from "react";
interface Role {
  id: number;
  title: string;
  created_by: string;
  created_at: string;
}

const useRoles = () => {
  const [allRoles, setAlRoles] = useState<Role[]>([]);

  const requestList = async () => {
    try {
      const request = await axios.get("http://localhost:8081/roles");
      const response = request.data;
      setAlRoles(response);

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
  return { allRoles };
};

export default useRoles;
