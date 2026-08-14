/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useLazyGetPermissionsQuery } from "./api";
import { logger } from "@/utils/logger";

export const usePermission = () => {
  const [triggerGet, getResult] = useLazyGetPermissionsQuery();

  const get = useCallback(
    async (params?: Record<string, unknown>) => {
      try {
        const trigger = triggerGet as (
          params?: Record<string, unknown>,
        ) => { unwrap: () => Promise<unknown> } & Promise<unknown>;
        return await trigger(params).unwrap();
      } catch (err) {
        logger.error("Failed to get permissions", err);
        throw err;
      }
    },
    [triggerGet],
  );

  return { get, getResult };
};
