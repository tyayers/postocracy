export class AppUser {
  id;
  email;
  userName;
  handle;
  photoUrl;
  providerId = "";
  status = "";
  postCount = 0;
  followerCount = 0;

  constructor(id: string, email: string, userName: string, handle: string, photoUrl: string) {
    this.id = id;
    this.email = email;
    this.userName = userName;
    this.handle = handle;
    this.photoUrl = photoUrl;
  }
}

export interface KeyValue {
  name: string;
  value: string;
}

export interface Error {
  code: string;
  message: string;
  status: string;
}

export class Post {
  id: string;
  indexId: string = "";
  authorId: string;
  authorDisplayName: string = "";
  authorPhotoUrl: string = "";
  title: string;
  summary: string = "";
  createdAt: string;
  edited: boolean = false;
  image: string = "";
  tags: string[] = [];
  content: string = "";
  fileCount: number = 0;
  likeCount: number = 0;
  commentCount: number = 0;

  constructor(id: string, authorId: string, title: string, createdAt: string) {
    this.id = id;
    this.authorId = authorId;
    this.title = title;
    this.createdAt = createdAt;
  }
}

export class PostIndex {
  id: string;
  index: Post[] = [];

  constructor(id: string) {
    this.id = id;
  }
}

export class NewPost {
  index?: PostIndex;
  post?: Post;
}

export interface DataProvider {
  createDir(name: string): void;
  writeFile(name: string, content: Buffer): void;
  getFile(name: string): Buffer | undefined;
}