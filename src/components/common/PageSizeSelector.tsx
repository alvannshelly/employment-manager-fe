interface Props {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const PageSizeSelector: React.FC<Props> = ({
  pageSize,
  onPageSizeChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-700">Show</label>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {[5, 10, 25, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">per page</span>
    </div>
  );
};
