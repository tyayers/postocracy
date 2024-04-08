export class AppUser {
  email = "";
  userName = "";
  photoUrl = "";
  providerId = "";
  status = "";
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

export interface Post {
  author: string;
  title: string;
  createdAt: string;
  tags: string[];
  content: string;
}