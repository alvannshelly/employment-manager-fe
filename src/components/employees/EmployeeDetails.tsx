import React from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { EmployeeWithReports } from "@/types/employee";
import { employeeApi } from "@/api/employeeApi";
import { EditEmployeeForm } from "@/components/employees/EditEmployeeForm";

interface Props {
  employeeId: number | null;
  onClose: () => void;
  onUpdated: () => void;
}

export const EmployeeDetails: React.FC<Props> = ({
  employeeId,
  onClose,
  onUpdated,
}) => {
  const [employeeDetails, setEmployeeDetails] =
    React.useState<EmployeeWithReports | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showEditForm, setShowEditForm] = React.useState(false);

  React.useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await employeeApi.getEmployeeById(employeeId);
        setEmployeeDetails(data);
      } catch (err) {
        setError("Failed to fetch employee details");
        console.error("Error fetching employee details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  const handleEditSuccess = async () => {
    if (employeeId) {
      try {
        setLoading(true);
        const data = await employeeApi.getEmployeeById(employeeId);
        setEmployeeDetails(data);
        onUpdated();
      } catch (err) {
        console.error("Error refreshing employee details:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Modal isOpen={!!employeeId} onClose={onClose} title="Employee Details">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : employeeDetails ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {employeeDetails.employee.name}
              </h3>
              <p className="text-gray-600">
                {employeeDetails.employee.position}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    employeeDetails.employee.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employeeDetails.employee.active ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Hire Date: {employeeDetails.employee.hireDate}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Direct Reports</h4>
              {employeeDetails.directReportNames.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {employeeDetails.directReportNames.map((name, index) => (
                    <li key={index} className="text-gray-600">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No direct reports</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setShowEditForm(true)}>
                Edit
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {showEditForm && employeeDetails && (
        <EditEmployeeForm
          employee={employeeDetails.employee}
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
