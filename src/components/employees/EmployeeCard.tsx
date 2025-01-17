import React from "react";
import { Employee } from "../../types/employee";
import { useEmployees } from "../../hooks/useEmployees";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { EmployeeDetails } from "./EmployeeDetails";

interface Props {
  employee: Employee;
  onDeactivated: () => void;
  onUpdated: () => void;
}

export const EmployeeCard: React.FC<Props> = ({
  employee,
  onDeactivated,
  onUpdated,
}) => {
  const { deactivateEmployee } = useEmployees();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const handleDeactivate = async () => {
    try {
      await deactivateEmployee(employee.id);
      setShowConfirmModal(false);
      onDeactivated();
    } catch (error) {
      console.error("Failed to deactivate employee:", error);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {employee.name}
            </h3>
            <p className="text-gray-600">{employee.position}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              employee.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {employee.active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Hire Date: {employee.hireDate}
          </p>
          <p className="text-sm text-gray-600">
            Direct Reports: {employee.directReports.length}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmModal(true);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Deactivation"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to deactivate {employee.name}?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>

      {showDetails && (
        <EmployeeDetails
          employeeId={employee.id}
          onClose={() => setShowDetails(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
};
