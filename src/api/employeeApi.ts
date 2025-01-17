import axios from "axios";
import {
  Employee,
  EmployeeWithReports,
  NewEmployee,
  PageResponse,
} from "../types/employee";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Response:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
);

interface SearchParams {
  name?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  page?: number;
  size?: number;
}

export const employeeApi = {
  getActiveEmployees: async (): Promise<Employee[]> => {
    const response = await axiosInstance.get(`/employees/active`);
    return response.data;
  },

  getEmployeeById: async (id: number): Promise<EmployeeWithReports> => {
    const response = await axiosInstance.get(`/employees/${id}`);
    return response.data;
  },

  getEmployeesByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<Employee[]> => {
    const response = await axiosInstance.get(
      `/employees/hired?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  createEmployee: async (employee: NewEmployee): Promise<Employee> => {
    try {
      // Validate the employee data before sending
      if (!employee.name || !employee.position || !employee.hireDate) {
        throw new Error("Missing required fields");
      }

      // Log the request payload
      console.log("Creating employee with data:", employee);

      const response = await axiosInstance.post("/employees", employee);
      return response.data;
    } catch (error: any) {
      console.error("Create employee error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  deactivateEmployee: async (id: number): Promise<Employee> => {
    const response = await axiosInstance.put(`/employees/${id}/deactivate`);
    return response.data;
  },

  updateEmployee: async (id: number, employee: Employee): Promise<Employee> => {
    try {
      const response = await axiosInstance.put(`/employees/${id}`, employee);
      return response.data;
    } catch (error: any) {
      console.error("Update employee error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  updatePosition: async (id: number, position: string): Promise<Employee> => {
    try {
      const response = await axiosInstance.put(
        `/employees/${id}/position`,
        position
      );
      return response.data;
    } catch (error: any) {
      console.error("Update position error:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  updateDirectReports: async (
    id: number,
    directReports: number[]
  ): Promise<Employee> => {
    try {
      const response = await axiosInstance.put(
        `/employees/${id}/direct-reports`,
        directReports
      );
      return response.data;
    } catch (error: any) {
      console.error("Update direct reports error:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  searchEmployees: async (
    params: SearchParams
  ): Promise<PageResponse<Employee>> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `/employees/search?${queryParams}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Search employees error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};
