export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:4000";

export const fetchFromApi = async (endpoint: string, method: string = 'GET') => {
  const response = await fetch(`${API_HOST}/${endpoint}`, {
    method,
    credentials: 'include'
  });
  return handleResponse(response);
};