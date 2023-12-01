const validatePassKey = (
  storedChallenge: string,
  clientChallenge: string,
): boolean => {
  return storedChallenge === clientChallenge;
};

export default validatePassKey;
