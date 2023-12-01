const generateRandomString = (lengthOfString: number): string => {
  const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return [...Array(lengthOfString)].reduce(
    (a) => a + p[~~(Math.random() * p.length)],
    "",
  ) as string;
};

export default generateRandomString;
