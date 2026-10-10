import type { JobApplication, NewApplicationProps } from "./types";

const BASE_URL = "http://localhost:8080/api";

const authFetch = async (
  path: string,
  token: string,
  init: RequestInit = {},
) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}`);
  }

  return response.json();
};

export const postApplication = (
  token: string,
  data: NewApplicationProps,
): Promise<JobApplication> => {
  return authFetch("/applications", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getApplications = (token: string): Promise<JobApplication[]> => {
  return authFetch("/applications", token);
};
