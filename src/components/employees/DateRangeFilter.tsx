import React from "react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface Props {
  onFilter: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

export const DateRangeFilter: React.FC<Props> = ({ onFilter, onClear }) => {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [dateError, setDateError] = React.useState<string | null>(null);

  const formatDateForApi = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate > endDate) {
      setDateError("Start date cannot be later than end date");
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (startDate && startDate > newEndDate) {
      setDateError("End date cannot be earlier than start date");
    } else {
      setDateError(null);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      if (startDate > endDate) {
        setDateError("Invalid date range");
        return;
      }
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);
      onFilter(formattedStartDate, formattedEndDate);
      setIsFiltered(true);
      setDateError(null);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setIsFiltered(false);
    setDateError(null);
    onClear();
  };

  return (
    <form
      onSubmit={handleFilter}
      className="bg-white p-4 rounded-lg shadow-sm mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || undefined}
            required
            error={dateError}
          />
        </div>
        <div className="flex-1">
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
            required
            error={dateError}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" variant="primary" disabled={!!dateError}>
            Filter
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            disabled={!isFiltered}
          >
            Clear
          </Button>
        </div>
      </div>
      {dateError && (
        <p className="mt-2 text-sm text-red-600 text-center">{dateError}</p>
      )}
    </form>
  );
};
