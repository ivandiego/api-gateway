export enum Role {
  Admin = 'admin',
  User = 'user',
}

export class User {
    id: string;
    username: string;
    role: Role;
  }
  