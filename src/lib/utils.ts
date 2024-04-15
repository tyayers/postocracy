import { Post } from "./interfaces";

// Generates a random string of a given length. Defaults to 6 characters.
export const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);

export function generateId(length: number = 8): string {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const yearString = currentDate.getFullYear().toString();
  const monthString: string = month < 10 ? "0" + month.toString() : month.toString();
  const dayString: string = day < 10 ? "0" + day.toString() : day.toString();

  let result = yearString + monthString + dayString + "_" + currentDate.getTime().toString() + "_" + generateRandomString(4);
  console.log(result);
  return result;
}

export function generateTimestampId(): string {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const yearString = currentDate.getFullYear().toString();
  const monthString: string = month < 10 ? "0" + month.toString() : month.toString();
  const dayString: string = day < 10 ? "0" + day.toString() : day.toString();

  let result = yearString + monthString + dayString + "_" + currentDate.getTime().toString();
  return result;
}

export function convertPostFormToObject(data: FormData): Promise<Post> {
  return new Promise<Post> ((resolve, reject) => {
    let postId = data.get("postId")?.toString();
    const indexId = data.get("indexId")?.toString();
    const authorId = data.get("authorId")?.toString();
    const authorDisplayName: string | undefined = data.get("authorDisplayName")?.toString();
    const authorPhotoUrl: string | undefined = data.get("authorPhotoUrl")?.toString();
    const title = data.get("title")?.toString();
    const summary = data.get("summary")?.toString();
    const content = data.get("content")?.toString();
    const imageUrl = data.get("imageUrl")?.toString();
    const currentDate = new Date();
    const createdAt: string = currentDate.toISOString();
  
    if (!postId)
      postId = generateId();
  
    if (!authorId || !title) {
      reject("Invalid data!");
    }
    else {
      let newPost: Post = new Post(postId, authorId, title, createdAt);
      if (authorDisplayName) newPost.authorDisplayName = authorDisplayName;
      if (authorPhotoUrl) newPost.authorPhotoUrl = authorPhotoUrl;
      if (summary) newPost.summary = summary;
      if (imageUrl) newPost.imageUrl = imageUrl;
      if (indexId) newPost.indexId = indexId;
      if (content) newPost.content = content;

      resolve(newPost);
    }
  });
}