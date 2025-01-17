import React, { useState, useEffect } from "react";
import { EmployeeCard } from "./EmployeeCard";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { DateRangeFilter } from "./DateRangeFilter";
import { employeeApi } from "@/api/employeeApi";
import { Employee, SearchParams } from "@/types/employee";
import { SearchBar } from "./SearchBar";
import { Pagination } from "../common/Pagination";
import { PageSizeSelector } from "../common/PageSizeSelector";

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [currentStartDate, setCurrentStartDate] = React.useState("");
  const [currentEndDate, setCurrentEndDate] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    name: "",
    position: "",
  });
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const refreshEmployees = async () => {
    try {
      const data = await employeeApi.searchEmployees({
        active: true,
        page: 0,
        size: pageSize,
      });
      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    if (searchParams.name || searchParams.position || isFiltered) {
      handleSearch(searchParams.name, searchParams.position);
    } else {
      handlePagedSearch();
    }
  }, [pageSize, currentPage]);

  const handleDateFilter = async (startDate: string, endDate: string) => {
    try {
      setCurrentStartDate(startDate);
      setCurrentEndDate(endDate);
      const data = await employeeApi.getEmployeesByDateRange(
        startDate,
        endDate
      );
      setEmployees(data);
      setIsFiltered(true);
    } catch (error) {
      console.error("Failed to filter employees:", error);
    }
  };

  const handleClearFilter = () => {
    refreshEmployees();
    setCurrentStartDate("");
    setCurrentEndDate("");
    setIsFiltered(false);
    setSearchParams({ name: "", position: "" });
  };

  const handleEmployeeUpdate = () => {
    if (isFiltered && currentStartDate && currentEndDate) {
      handleDateFilter(currentStartDate, currentEndDate);
    } else {
      refreshEmployees();
    }
  };

  const handleSearch = async (name: string, position: string) => {
    try {
      const params: SearchParams = {
        name: name || undefined,
        position: position || undefined,
        active: true,
        page: currentPage,
        size: pageSize,
      };

      if (isFiltered && currentStartDate && currentEndDate) {
        params.startDate = currentStartDate;
        params.endDate = currentEndDate;
      }

      const data = await employeeApi.searchEmployees(params);
      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setSearchParams({ name, position });
    } catch (error: any) {
      console.error("Failed to search employees:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
    handleSearch(searchParams.name, searchParams.position);
  };

  const handlePagedSearch = async () => {
    try {
      const params: SearchParams = {
        active: true,
        page: currentPage,
        size: pageSize,
      };

      const data = await employeeApi.searchEmployees(params);
      setEmployees(data.content);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error("Failed to fetch paged employees:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <AddEmployeeForm onSuccess={handleEmployeeUpdate} />
      </div>
      <SearchBar onSearch={handleSearch} />
      <DateRangeFilter
        onFilter={handleDateFilter}
        onClear={handleClearFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onDeactivated={handleEmployeeUpdate}
            onUpdated={handleEmployeeUpdate}
          />
        ))}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
