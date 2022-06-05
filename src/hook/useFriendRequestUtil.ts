import { useEffect, useState } from "react";
import { isPending, isRequested } from "../services/friendService";

export function useCheckRequested(
  requestingUserId: string,
  targetUserId: string
): boolean {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    async function getResult() {
      setRequested(await isRequested(requestingUserId, targetUserId));
    }
    getResult();
  }, []);

  return requested;
}

export function useCheckPending(
  requestingUserId: string,
  targetUserId: string
): boolean {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function getResult() {
      setPending(await isPending(requestingUserId, targetUserId));
    }
    getResult();
  }, []);

  return pending;
}
