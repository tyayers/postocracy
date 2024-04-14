// Generates a random string of a given length. Defaults to 6 characters.
export const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);

export function generatePostId(): string {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const yearString = currentDate.getFullYear().toString();
  const monthString: string = month < 10 ? "0" + month.toString() : month.toString();
  const dayString: string = day < 10 ? "0" + day.toString() : day.toString();

  let result = yearString + monthString + dayString + "_" + generateRandomString(8);
  return result;
}