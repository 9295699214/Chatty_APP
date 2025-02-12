import { useState, useEffect } from 'react';

const useAuthStore = () => {
  const [authUser, setAuthUser] = useState(null);

  const fetchAuthUser = async () => {
    try {
      console.log('Fetching auth user...');
      const response = await fetch('/api/auth-user', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache', // Ensure no caching on the client side
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);

      const data = JSON.parse(responseText);
      console.log('Parsed data:', data);
      setAuthUser(data);
    } catch (error) {
      console.error('Failed to fetch auth user:', error);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  return { authUser };
};

export default useAuthStore;
