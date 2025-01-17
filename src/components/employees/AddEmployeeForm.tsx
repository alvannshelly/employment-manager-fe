import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useEmployees } from "@/hooks/useEmployees";
import { NewEmployee, EmployeePosition } from "@/types/employee";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatDateForApi } from "@/utils/dateUtils";
import { AnyObject } from "yup";

interface Props {
  onSuccess: () => void;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  position: yup.string().oneOf(Object.values(EmployeePosition)).required(),
  hireDate: yup.string().required(),
  directReports: yup.array().of(yup.number()).transform((value) => value || []),
  active: yup.boolean().transform((value) => value ?? true),
});

type FormData = {
  name: string;
  position: EmployeePosition;
  hireDate: string;
  directReports: number[];
  active: boolean;
};

export const AddEmployeeForm: React.FC<Props> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { createEmployee } = useEmployees();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      directReports: [],
      active: true,
    },
  });

  const generateRandomId = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const onSubmit = async (data: {
    name: string;
    position: EmployeePosition;
    hireDate: string;
    directReports: number[];
    active: boolean;
  }) => {
    try {
      console.log("Form submitted with data:", data);

      const formattedData: NewEmployee = {
        id: generateRandomId(),
        name: data.name.trim(),
        position: data.position,
        active: true,
        directReports: [],
        hireDate: formatDateForApi(data.hireDate),
      };

      console.log("Formatted data:", formattedData);

      await createEmployee(formattedData);
      setIsOpen(false);
      reset();
      onSuccess();
    } catch (error: any) {
      console.error("Failed to create employee:", error);
      alert("Failed to create employee. Please try again.");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Employee</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Employee"
      >
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
              <option value="">Select a position</option>
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
            max={new Date().toISOString().split("T")[0]}
            {...register("hireDate")}
            error={errors.hireDate?.message}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Employee
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
