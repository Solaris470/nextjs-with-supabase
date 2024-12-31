import React from "react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  viewMode,
  setViewMode,
}) => {
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    onSearch(query);
  };

  return (
    <div
      id="filter-tab"
      className="bg-white border shadow-sm rounded-lg relative w-full p-5 flex items-center justify-between mb-3"
    >
      <div className="flex items-center gap-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg"
          >
            <svg
              className="w-[40px] h-[40px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.2"
                d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-900 bg-transparent border-e border-t border-b border-gray-900 "
          >
            Filter By
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-900 bg-transparent border-e border-t border-b border-gray-900 "
          >
            Date{" "}
            <svg
              className="w-[36px] h-[36px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-900 bg-transparent border-e border-t border-b border-gray-900 "
          >
            Type{" "}
            <svg
              className="w-[36px] h-[36px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-gray-900 bg-transparent border-e border-t border-b border-gray-900"
          >
            Status{" "}
            <svg
              className="w-[36px] h-[36px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-red-600 bg-transparent border-e border-t border-b border-red-600 rounded-e-lg"
          >
            <svg
              className="w-[20px] h-[20px] text-red-600 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.2"
                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
              />
            </svg>
            Reset Filter
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
          <div className="relative ">
            <input
              type="search"
              name="query"
              id="location-search"
              className="block px-10 py-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="ค้นหาด้วยชื่องาน"
              required
            />
            <button
              type="submit"
              className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2">
        <svg
          onClick={() => setViewMode("card")}
          className={`w-6 h-6 cursor-pointer ${viewMode === "card" ? "text-blue-500" : "text-gray-800"} dark:text-white`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
          />
        </svg>
        <svg
          onClick={() => setViewMode("table")}
          className={`w-6 h-6 cursor-pointer ${viewMode === "table" ? "text-blue-500" : "text-gray-800"} dark:text-white`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M3 11h18M3 15h18M8 10.792V19m4-8.208V19m4-8.208V19M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default FilterBar;
