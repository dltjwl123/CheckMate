export const apiErrorHandler = (error: unknown) => {
  console.error(error);
  throw error;
};
