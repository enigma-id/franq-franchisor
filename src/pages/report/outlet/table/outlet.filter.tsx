/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { MonthPicker, RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useIsSuperuser } from "@/utils/permission";
import TableFilters from "@/components/ui/table/filter";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State:
      | {
          loading: boolean;
          filter: any;
        }
      | undefined;
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const isSuperuser = useIsSuperuser();

  // ── Franchisor (khusus superuser) — dikirim sebagai `brand_id` ke report ──
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();
  const [franchisor, setFranchisor] = useState<any | null>(null);

  // ── Outlet (khusus superuser) ──
  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    if (!isSuperuser) return;
    getFranchisors({ page: 1, limit: 20 });
  }, [isSuperuser]);

  useEffect(() => {
    if (!isSuperuser) return;
    getOutlet({
      page: 1,
      limit: 20,
      status: "active",
      franchisor_id: franchisor?.id,
    });
  }, [isSuperuser, franchisor?.id]);

  useEffect(() => {
    if (!isSuperuser) return;
    if (current.brand_id && getFranchisorsResult?.data?.data) {
      const franchisors = getFranchisorsResult.data.data as any[];
      const found = franchisors.find((c: any) => c.id === current.brand_id);
      if (found) setFranchisor(found);
    } else if (!current.brand_id) {
      setFranchisor(null);
    }
  }, [current.brand_id, getFranchisorsResult?.data?.data, isSuperuser]);

  useEffect(() => {
    if (!isSuperuser) return;
    if (current.outlet_id && getOutletResult?.data?.data) {
      const outlets = getOutletResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getOutletResult?.data?.data, isSuperuser]);

  const [periode, setPeriode] = useState<string>(() => {
    const cur = current.periode as string | undefined;
    return cur || dayjs().format("YYYY-MM");
  });

  const buildFilters = (): Record<string, any> => ({
    periode,
    // Bersihkan nilai rentang tanggal lama yang mungkin masih tersimpan.
    start_date: "",
    end_date: "",
    // Scope brand/outlet hanya relevan untuk superuser — user brand sudah
    // otomatis ter-scope oleh session di backend.
    ...(isSuperuser
      ? { brand_id: franchisor?.id ?? "", outlet_id: outlet?.id ?? "" }
      : {}),
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.periode || "") !== (current.periode || "") ||
      (isSuperuser &&
        ((f.brand_id || "") !== (current.brand_id || "") ||
          (f.outlet_id || "") !== (current.outlet_id || "")))
    );
  }, [periode, franchisor, outlet, current, isSuperuser]);

  const anyActive = !!(
    current.periode ||
    (isSuperuser && (current.brand_id || current.outlet_id))
  );

  const handleClear = () => {
    const defaultPeriode = dayjs().format("YYYY-MM");
    setFranchisor(null);
    setOutlet(null);
    setPeriode(defaultPeriode);
    table.filter({
      periode: defaultPeriode,
      start_date: "",
      end_date: "",
      ...(isSuperuser ? { brand_id: "", outlet_id: "" } : {}),
    });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        {isSuperuser && (
          <>
            <RemoteSelect
              label='Franchisor'
              placeholder='Filter Franchisor'
              value={franchisor}
              onChange={(val) => {
                setFranchisor(val);
                setOutlet(null);
              }}
              onClear={() => {
                setFranchisor(null);
                setOutlet(null);
              }}
              fetchData={(page, search) =>
                getFranchisors({ page: page || 1, limit: 20, search })
              }
              hook={getFranchisorsResult as any}
              getLabel={(item: any) => item?.name ?? ""}
              renderItem={(item: any) => item?.name}
              getValue={(item: any) => item.id}
            />
            <RemoteSelect
              label='Outlet'
              placeholder='Filter Outlet'
              value={outlet}
              onChange={(val) => setOutlet(val)}
              onClear={() => setOutlet(null)}
              fetchData={(page, search) =>
                getOutlet({
                  page: page || 1,
                  limit: 20,
                  search,
                  franchisor_id: franchisor?.id,
                })
              }
              hook={getOutletResult as any}
              getLabel={(item: any) => item?.name ?? ""}
              renderItem={(item: any) => item?.name}
              getValue={(item: any) => item.id}
            />
          </>
        )}
        <MonthPicker
          label='Periode'
          value={periode}
          onChange={setPeriode}
          placeholder='Filter Periode'
          className='w-full'
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
