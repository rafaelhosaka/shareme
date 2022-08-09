import httpService from "./httpService";

export function resendEmail(email: string) {
  return httpService.get(`resend/${email}`);
}
