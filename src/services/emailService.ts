import httpService from "./httpService";

export function verifyEmail(token: string) {
  return httpService.get(`registrationConfirm?token=${token}`);
}

export function resendEmail(email: string) {
  return httpService.get(`resend/${email}`);
}
