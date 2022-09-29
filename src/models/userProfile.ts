import { LanguageEntity } from "./language";

export default class UserProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  gender: string;
  fileName: string;
  coverFileName: string;
  friends: string[];
  themePreference: string;
  languagePreference: LanguageEntity;
  online: boolean;
  connected: boolean;
  roles: string[];

  constructor(data: UserProfileEntity) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.fileName = data.fileName;
    this.coverFileName = data.coverFileName;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.friends = data.friends;
    this.themePreference = data.themePreference;
    this.languagePreference = data.languagePreference;
    this.online = data.online;
    this.connected = data.connected;
    this.roles = [];
  }

  get friendCount(): number {
    return this.friends.length;
  }
}

export class UserProfileDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  gender: string;
  fileName: string;
  friends: string[];
  themePreference: string;
  coverFileName: string;
  languagePreference: LanguageEntity;

  constructor(data: UserProfileEntity) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.fileName = data.fileName;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.friends = data.friends;
    this.themePreference = data.themePreference;
    this.coverFileName = data.coverFileName;
    this.languagePreference = data.languagePreference;
  }
}
