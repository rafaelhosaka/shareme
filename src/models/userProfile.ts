export default class UserProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  gender: string;
  friends: string[];
  roles: string[];

  constructor(data: UserProfileEntity) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.friends = data.friends;
    this.roles = [];
  }

  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  get friendCount(): number {
    return this.friends.length;
  }
}
