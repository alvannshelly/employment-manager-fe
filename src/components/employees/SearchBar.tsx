import React, { useEffect, useCallback } from "react";
import { Input } from "@/components/common/Input";
import { EmployeePosition } from "@/types/employee";
import debounce from "lodash/debounce";

interface Props {
  onSearch: (name: string, position: string) => void;
}

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [name, setName] = React.useState("");
  const [position, setPosition] = React.useState("");

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((name: string, position: string) => {
      onSearch(name, position);
    }, 300),
    []
  );

  // Effect for name changes
  useEffect(() => {
    debouncedSearch(name, position);
    return () => debouncedSearch.cancel();
  }, [name, debouncedSearch]);

  // Immediate search for position changes
  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPosition = e.target.value;
    setPosition(newPosition);
    onSearch(name, newPosition);
  };

  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            label="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter employee name..."
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by position
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={position}
            onChange={handlePositionChange}
          >
            <option value="">All positions</option>
            {Object.values(EmployeePosition).map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
