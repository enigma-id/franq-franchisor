import { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { useOutletType } from "@/services/outlet/hooks";
import { useRegion } from "@/services/region/hooks";
import { useAppSelector } from "@/hooks";

export interface StoreOutletFormData extends Record<string, unknown> {
  name: string;
  outlet_type_id: number;
  phone: string;
  pic_name: string;
  pic_phone: string;
  username: string;
  pin: string;
  address: string;
  province_id: string;
  regency_id: string;
  district_id: string;
  village_id: string;
}

interface StoreOutletFormProps {
  id?: string;
  initialData?: Partial<StoreOutletFormData>;
  onSubmit: (data: StoreOutletFormData) => void;
}

export function StoreOutletForm({
  id = "store-outlet-form",
  initialData,
  onSubmit,
}: StoreOutletFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const { get: getOutletTypes, getResult: outletTypesResult } = useOutletType();

  // Geographic region custom hook
  const {
    provinces,
    isLoadingProvinces,
    getProvinces,
    regencies,
    isLoadingRegencies,
    getRegencies,
    districts,
    isLoadingDistricts,
    getDistricts,
    villages,
    isLoadingVillages,
    getVillages,
  } = useRegion();

  const [provinceSelected, setProvinceSelected] = useState<any | null>(null);
  const [regencySelected, setRegencySelected] = useState<any | null>(null);
  const [districtSelected, setDistrictSelected] = useState<any | null>(null);
  const [villageSelected, setVillageSelected] = useState<any | null>(null);
  const [outletTypeSelected, setOutletTypeSelected] = useState<any | null>(
    null,
  );

  const [formData, setFormData] = useState<StoreOutletFormData>({
    name: "",
    outlet_type_id: 0,
    phone: "",
    pic_name: "",
    pic_phone: "",
    username: "",
    pin: "",
    address: "",
    province_id: "",
    regency_id: "",
    district_id: "",
    village_id: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        outlet_type_id: initialData.outlet_type_id ?? 0,
        phone: initialData.phone ?? "",
        pic_name: initialData.pic_name ?? "",
        pic_phone: initialData.pic_phone ?? "",
        username: initialData.username ?? "",
        pin: initialData.pin ?? "",
        address: initialData.address ?? "",
        province_id: initialData.province_id ?? "",
        regency_id: initialData.regency_id ?? "",
        district_id: initialData.district_id ?? "",
        village_id: initialData.village_id ?? "",
      });

      if (initialData.outlet_type_id) {
        setOutletTypeSelected(initialData.outlet_type ?? { id: initialData.outlet_type_id, name: "Tipe Outlet Terpilih" });
      }
      if (initialData.province_id) {
        setProvinceSelected(initialData.province ?? { id: initialData.province_id, name: "Provinsi Terpilih" });
        getRegencies(initialData.province_id);
      }
      if (initialData.regency_id) {
        setRegencySelected(initialData.regency ?? { id: initialData.regency_id, name: "Kabupaten/Kota Terpilih" });
        getDistricts(initialData.regency_id);
      }
      if (initialData.district_id) {
        setDistrictSelected(initialData.district ?? { id: initialData.district_id, name: "Kecamatan Terpilih" });
        getVillages(initialData.district_id);
      }
      if (initialData.village_id) {
        setVillageSelected(initialData.village ?? { id: initialData.village_id, name: "Kelurahan/Desa Terpilih" });
      }
    }
  }, [initialData]);

  const handleProvinceChange = (province: any) => {
    setProvinceSelected(province);
    setRegencySelected(null);
    setDistrictSelected(null);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      province_id: province?.id || "",
      regency_id: "",
      district_id: "",
      village_id: "",
    }));
    if (province?.id) {
      getRegencies(province.id);
    }
  };

  const handleProvinceClear = () => {
    setProvinceSelected(null);
    setRegencySelected(null);
    setDistrictSelected(null);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      province_id: "",
      regency_id: "",
      district_id: "",
      village_id: "",
    }));
  };

  const handleRegencyChange = (regency: any) => {
    setRegencySelected(regency);
    setDistrictSelected(null);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      regency_id: regency?.id || "",
      district_id: "",
      village_id: "",
    }));
    if (regency?.id) {
      getDistricts(regency.id);
    }
  };

  const handleRegencyClear = () => {
    setRegencySelected(null);
    setDistrictSelected(null);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      regency_id: "",
      district_id: "",
      village_id: "",
    }));
  };

  const handleDistrictChange = (district: any) => {
    setDistrictSelected(district);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      district_id: district?.id || "",
      village_id: "",
    }));
    if (district?.id) {
      getVillages(district.id);
    }
  };

  const handleDistrictClear = () => {
    setDistrictSelected(null);
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      district_id: "",
      village_id: "",
    }));
  };

  const handleVillageChange = (village: any) => {
    setVillageSelected(village);
    setFormData((prev) => ({
      ...prev,
      village_id: village?.id || "",
    }));
  };

  const handleVillageClear = () => {
    setVillageSelected(null);
    setFormData((prev) => ({
      ...prev,
      village_id: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Section 1: Informasi Utama */}
      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
          Informasi Utama
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Outlet"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Contoh: Suka Bread Express Bandung"
            variant="primary"
            error={FormState?.errors?.name as string}
          />
          <RemoteSelect
            label="Tipe Outlet"
            placeholder="Pilih Tipe Outlet"
            value={outletTypeSelected}
            hook={outletTypesResult as any}
            fetchData={(page, search) =>
              getOutletTypes({ page, search }) as any
            }
            getLabel={(item: any) => item?.name || ""}
            getValue={(item: any) => item?.id}
            onChange={(val) => {
              setOutletTypeSelected(val);
              setFormData((prev) => ({
                ...prev,
                outlet_type_id: val?.id || 0,
              }));
            }}
            onClear={() => {
              setOutletTypeSelected(null);
              setFormData((prev) => ({ ...prev, outlet_type_id: 0 }));
            }}
            required
            error={FormState?.errors?.outlet_type_id as string}
          />
          <Input
            label="No. Telepon Outlet"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Contoh: 022123456"
            variant="primary"
            error={FormState?.errors?.phone as string}
          />
        </div>
      </div>

      {/* Section 2: Informasi PIC & Kredensial Owner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
            Person In Charge (PIC)
          </h3>
          <Input
            label="Nama PIC"
            required
            value={formData.pic_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, pic_name: e.target.value }))
            }
            placeholder="Contoh: Budi Santoso"
            variant="primary"
            error={FormState?.errors?.pic_name as string}
          />
          <Input
            label="No. Telepon PIC"
            required
            value={formData.pic_phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, pic_phone: e.target.value }))
            }
            placeholder="Contoh: 081234567890"
            variant="primary"
            error={FormState?.errors?.pic_phone as string}
          />
        </div>

        <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
            Akun Pemilik (Owner Credentials)
          </h3>
          <Input
            label="Username Pemilik"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="Contoh: budi_sukabread"
            variant="primary"
            error={FormState?.errors?.username as string}
          />
          <Input
            label="PIN (6 Digit Angka)"
            required
            type="password"
            maxLength={6}
            value={formData.pin}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                pin: e.target.value.replace(/\D/g, ""),
              }))
            }
            placeholder="Contoh: 123456"
            variant="primary"
            error={FormState?.errors?.pin as string}
          />
        </div>
      </div>

      {/* Section 3: Regional & Alamat */}
      <div className="card-info bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2">
          Regional & Lokasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RemoteSelect
            label="Provinsi"
            placeholder="Pilih Provinsi"
            value={provinceSelected}
            hook={{ data: provinces, isLoading: isLoadingProvinces } as any}
            fetchData={(page, search) =>
              getProvinces({ page, search }) as any
            }
            getLabel={(item: any) => item?.name || ""}
            getValue={(item: any) => item?.id}
            onChange={handleProvinceChange}
            onClear={handleProvinceClear}
            required
            error={FormState?.errors?.province_id as string}
          />
          <RemoteSelect
            label="Kabupaten / Kota"
            placeholder="Pilih Kabupaten / Kota"
            value={regencySelected}
            hook={{ data: regencies, isLoading: isLoadingRegencies } as any}
            fetchData={(page, search) =>
              getRegencies(formData.province_id, { page, search }) as any
            }
            getLabel={(item: any) => item?.name || ""}
            getValue={(item: any) => item?.id}
            onChange={handleRegencyChange}
            onClear={handleRegencyClear}
            required
            disabled={!formData.province_id}
            error={FormState?.errors?.regency_id as string}
          />
          <RemoteSelect
            label="Kecamatan"
            placeholder="Pilih Kecamatan"
            value={districtSelected}
            hook={{ data: districts, isLoading: isLoadingDistricts } as any}
            fetchData={(page, search) =>
              getDistricts(formData.regency_id, { page, search }) as any
            }
            getLabel={(item: any) => item?.name || ""}
            getValue={(item: any) => item?.id}
            onChange={handleDistrictChange}
            onClear={handleDistrictClear}
            required
            disabled={!formData.regency_id}
            error={FormState?.errors?.district_id as string}
          />
          <RemoteSelect
            label="Kelurahan / Desa"
            placeholder="Pilih Kelurahan / Desa"
            value={villageSelected}
            hook={{ data: villages, isLoading: isLoadingVillages } as any}
            fetchData={(page, search) =>
              getVillages(formData.district_id, { page, search }) as any
            }
            getLabel={(item: any) => item?.name || ""}
            getValue={(item: any) => item?.id}
            onChange={handleVillageChange}
            onClear={handleVillageClear}
            required
            disabled={!formData.district_id}
            error={FormState?.errors?.village_id as string}
          />
        </div>
        <div className="space-y-1">
          <Input
            label="Alamat Lengkap"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Contoh: Jl. Diponegoro No. 22"
            variant="primary"
            error={FormState?.errors?.address as string}
          />
          <div className="flex justify-end text-xs text-slate-400">
            {formData.address.length}/130 karakter
          </div>
        </div>
      </div>
    </form>
  );
}
