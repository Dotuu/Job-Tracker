import type { NewApplicationProps } from "@/components/NewApplication";

export const loadApplicationData = async () => {
  const route: string = "http://localhost:5173/api/applications";
  try {
    const response = await fetch(route, {
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    });

    if (!response.ok) {
      throw new Error("Response failed!");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const submitApplication = async (
  applicationData: NewApplicationProps,
) => {
  const route: string = `http://localhost:5173/api/applications`;

  const response = await fetch(route, {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  return response.json();
};
