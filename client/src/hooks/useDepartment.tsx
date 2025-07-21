import axios from "axios";
import { useEffect, useState } from "react";

interface Department {
  id: number;
  department: string;
  description: string;
  manager: number;
  total_members: number;
  Created_by: number;
  Created_at: string;
  is_active: number;
}

const useDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  const requestList = async () => {
    try {
      const request = await axios.get("http://localhost:8081/departments");
      const response = request.data;
      setDepartments(response);
      console.log(response);

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
  return { departments };
};

export default useDepartment;
