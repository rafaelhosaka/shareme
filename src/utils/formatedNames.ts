import UserProfileEntity from "../models/userProfile";

export function fullName(user: UserProfileEntity | undefined) {
  if (!user) {
    return "";
  }

  if (user.languagePreference) {
    switch (user.languagePreference.shortName) {
      case "ja":
        return `${user.lastName} ${user.firstName}`;
      default:
        return `${user.firstName} ${user.lastName}`;
    }
  } else {
    return `${user.firstName} ${user.lastName}`;
  }
}
