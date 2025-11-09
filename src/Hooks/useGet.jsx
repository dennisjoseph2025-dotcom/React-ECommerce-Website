// hooks/useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGet = (endpoint,key) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:2345';

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${BASE_URL}/${endpoint}`);
      if (endpoint== "users"){
        setData(response.data); 
      }
      else{

        setData(response.data[key]); 
      }
  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refetch = () => {
    fetchData();
  };

  // Auto-fetch when endpoint changes
  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [endpoint, key]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useGet;