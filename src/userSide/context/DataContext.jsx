import { createContext,useEffect } from "react";

export const DataContext = createContext({
  data: [],
  setData: () => {},
  filteredData: [],
  setFilteredData: () => {},
  search: '',
  setSearch: () => {},
  type: '',
  setType: () => {},
  sort: '',
  setSort: () => {},
});
