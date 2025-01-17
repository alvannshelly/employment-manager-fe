import { useState, useCallback } from "react";
import { Employee, NewEmployee } from "../types/employee";
import { employeeApi } from "../api/employeeApi";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeeApi.getActiveEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (newEmployee: NewEmployee) => {
    try {
      setLoading(true);
      const created = await employeeApi.createEmployee(newEmployee);
      setEmployees((prev) => [...prev, created]);
      setError(null);
      return created;
    } catch (err) {
      setError("Failed to create employee");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateEmployee = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await employeeApi.deactivateEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to deactivate employee");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setFilteredEmployees = useCallback((filteredEmployees: Employee[]) => {
    setEmployees(filteredEmployees);
  }, []);

  return {
    employees,
    loading,
    error,
    fetchActiveEmployees,
    createEmployee,
    deactivateEmployee,
    setFilteredEmployees,
  };
};
