export const loadApplicationData = async () => {
  const applicationUrl = "http://localhost:5173/api/applications";
  try {
    const response = await fetch(applicationUrl);

    if (!response.ok) {
      throw new Error("Response failed!");
    }

    const result = await response.json();
    return result;
  } catch (err) {}
};
