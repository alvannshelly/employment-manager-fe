import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Employee, EmployeePosition } from "@/types/employee";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { employeeApi } from "@/api/employeeApi";
import { formatDateForApi, formatDateForInput } from "@/utils/dateUtils";
import { useEffect, useState } from "react";

interface Props {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(2).max(100).trim(),
  position: yup
    .string()
    .required("Position is required")
    .oneOf(Object.values(EmployeePosition)),
  hireDate: yup
    .string()
    .required("Hire date is required")
    .test(
      "not-future",
      "Hire date cannot be in the future",
      (value) => !value || new Date(value) <= new Date()
    ),
  directReports: yup.array().of(yup.number().required()).default([]),
});

interface FormData {
  name: string;
  position: EmployeePosition;
  hireDate: string;
  directReports: number[];
}

export const EditEmployeeForm: React.FC<Props> = ({
  employee,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: employee.name,
      position: employee.position,
      hireDate: formatDateForInput(employee.hireDate),
    },
  });

  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeApi.getActiveEmployees();
        setAvailableEmployees(data.filter((emp) => emp.id !== employee.id));
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, [employee.id]);

  const onSubmit = async (data: FormData) => {
    try {
      const updatedEmployee = {
        ...employee,
        ...data,
        hireDate: formatDateForApi(data.hireDate as string),
      };
      await employeeApi.updateEmployee(employee.id, updatedEmployee);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            {...register("position")}
          >
            {Object.values(EmployeePosition).map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          {errors.position?.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.position.message}
            </p>
          )}
        </div>

        <Input
          type="date"
          label="Hire Date"
          {...register("hireDate")}
          error={errors.hireDate?.message}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Direct Reports
          </label>
          <select
            multiple
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[120px]"
            {...register("directReports")}
            defaultValue={employee.directReports.map(String)}
          >
            {availableEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} - {emp.position}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Hold Ctrl/Cmd to select multiple employees
          </p>
          {errors.directReports?.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.directReports.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
