import { useFormActions } from "../form/hooks";
import {
  useLazyGetProvincesQuery,
  useLazyGetRegenciesQuery,
  useLazyGetDistrictsQuery,
  useLazyGetVillagesQuery,
} from "./api";

export const useRegion = () => {
  const [triggerProvinces, provincesResult] = useLazyGetProvincesQuery();
  const [triggerRegencies, regenciesResult] = useLazyGetRegenciesQuery();
  const [triggerDistricts, districtsResult] = useLazyGetDistrictsQuery();
  const [triggerVillages, villagesResult] = useLazyGetVillagesQuery();
  const { failureWithTimeout } = useFormActions();

  const getProvinces = async (params: any = {}) => {
    try {
      await triggerProvinces(params).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getRegencies = async (id: string, params: any = {}) => {
    try {
      await triggerRegencies({ id, ...params }).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getDistricts = async (id: string, params: any = {}) => {
    try {
      await triggerDistricts({ id, ...params }).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  const getVillages = async (id: string, params: any = {}) => {
    try {
      await triggerVillages({ id, ...params }).unwrap();
    } catch (error) {
      failureWithTimeout(error);
    }
  };

  return {
    provinces: provincesResult.data,
    isLoadingProvinces: provincesResult.isLoading,
    getProvinces,
    regencies: regenciesResult.data,
    isLoadingRegencies: regenciesResult.isLoading,
    getRegencies,
    districts: districtsResult.data,
    isLoadingDistricts: districtsResult.isLoading,
    getDistricts,
    villages: villagesResult.data,
    isLoadingVillages: villagesResult.isLoading,
    getVillages,
  };
};
