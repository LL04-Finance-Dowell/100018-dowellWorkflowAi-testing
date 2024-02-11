export const localStorageGetItem = (session) => {
  const currentSession = localStorage.getItem(session)
    ? JSON.parse(localStorage.getItem(session))
    : null;

  return currentSession;
};
