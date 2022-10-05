export interface GroupEntity {
  id: string;
  admins: string[];
  members: string[];
  name: string;
  dateCreated: Date;
  coverFileName?: string;
}
