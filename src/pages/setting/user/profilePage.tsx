import { Page } from "@/components/app/layout";
import { useEffect, useState } from "react";
import { Button, Input, Loading } from "@/components/ui";
import {
  Edit2,
  Save,
  X,
  RefreshCw,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Calendar,
} from "lucide-react";
import { useEnigmaUI } from "@/components";
import { useAuth } from "@/services/auth/hook";
import { useAppSelector } from "@/hooks";

interface UserProfile {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  usergroup?: { name?: string };
  last_login_at?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
      <div className="mr-4 p-3 rounded-xl bg-white text-slate-600 shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-base font-semibold text-slate-800 wrap-break-words mt-0.5">
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { showToast } = useEnigmaUI();
  const FormState = useAppSelector((s) => s.form);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { refreshProfile, refreshResult, updateProfile, updateResult } =
    useAuth();

  const {
    isLoading: isLoadingFetch,
    data: detailData,
    isError: isFetchError,
  } = refreshResult;
  const { isLoading: isUpdating, isSuccess: isUpdateSuccess } = updateResult;

  const data = (detailData as any)?.data ?? detailData?.data ?? null;
  const profileDetail = data?.user;

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (profileDetail) {
      setProfile(profileDetail);
      setFormData({
        name: profileDetail.name ?? "",
        email: profileDetail.email ?? "",
        phone: profileDetail.phone ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [profileDetail]);

  useEffect(() => {
    if (isFetchError) {
      showToast({
        message: "Gagal mengambil data profil",
        type: "error",
      });
    }
  }, [isFetchError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      showToast({
        message: "Profil berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      setIsEditing(false);
      refreshProfile({});
      updateResult.reset?.();
    }
  }, [isUpdateSuccess, refreshProfile, updateResult]);

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        password: "",
        confirmPassword: "",
      });
      setIsEditing(true);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleSaveClick = () => {
    const payload: Record<string, any> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    if (formData.password) {
      payload.password = formData.password;
      payload.confirm_password = formData.confirmPassword;
    }

    updateProfile(payload);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="My Profile"
        subtitle={
          isEditing
            ? "Perbarui informasi profil dan kredensial Anda."
            : "Informasi profil akun Anda."
        }
        backTo={isEditing ? handleCancelClick : undefined}
        action={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                styleType="outline"
                onClick={handleCancelClick}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                variant="success"
                onClick={handleSaveClick}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loading size="sm" variant="spinner" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleEditClick}
              disabled={isLoadingFetch || !profile}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Ubah Profil
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        {isLoadingFetch ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Memuat profil Anda...
            </p>
          </div>
        ) : profile ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {isEditing ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6 transition-all duration-300">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Informasi Profil
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ubah data umum profil Anda di bawah ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nama"
                    required
                    prefix={<User className="w-4 h-4 text-slate-400" />}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                    }}
                    error={FormState?.errors?.name as string}
                  />
                  <div className="flex flex-col justify-end pb-1">
                    <label className="pb-2 block">
                      <span className="text-base-content text-[10px] leading-[1.2] uppercase font-semibold tracking-[.6px]">
                        Username
                      </span>
                    </label>
                    <div className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 text-sm font-medium h-[42px] select-none">
                      <Shield className="w-4 h-4 text-slate-400 mr-2" />
                      {profile.username}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Username tidak dapat diubah
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-base font-bold text-slate-800">
                    Ubah Password (Opsional)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Kosongkan jika Anda tidak ingin mengubah password akun Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Password Baru"
                    type="password"
                    prefix={<Lock className="w-4 h-4 text-slate-400" />}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    error={FormState?.errors?.password as string}
                  />
                  <Input
                    label="Konfirmasi Password Baru"
                    type="password"
                    prefix={<Lock className="w-4 h-4 text-slate-400" />}
                    placeholder="Ulangi password baru"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                    }}
                    error={
                      (FormState?.errors?.confirm_password ||
                        FormState?.errors?.confirmPassword) as string
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-2xl shadow-sm">
                    {profile.name?.substring(0, 2).toUpperCase() || "ME"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      {profile.name}
                    </h2>
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-wider">
                      {profile.usergroup?.name || "User"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <InfoField
                    label="Nama"
                    value={profile.name}
                    icon={<User className="w-5 h-5 text-indigo-500" />}
                  />
                  <InfoField
                    label="Username"
                    value={profile.username}
                    icon={<Shield className="w-5 h-5 text-violet-500" />}
                  />
                  <InfoField
                    label="Email"
                    value={profile.email}
                    icon={<Mail className="w-5 h-5 text-emerald-500" />}
                  />
                  <InfoField
                    label="Telepon"
                    value={profile.phone}
                    icon={<Phone className="w-5 h-5 text-sky-500" />}
                  />
                  <InfoField
                    label="User Group"
                    value={profile.usergroup?.name}
                    icon={<Lock className="w-5 h-5 text-amber-500" />}
                  />
                  {profile.last_login_at &&
                    profile.last_login_at !== "0001-01-01T00:00:00Z" && (
                      <InfoField
                        label="Last Login"
                        value={new Date(profile.last_login_at).toLocaleString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        icon={<Calendar className="w-5 h-5 text-pink-500" />}
                      />
                    )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100 max-w-4xl mx-auto">
            <RefreshCw className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
            <p className="text-lg font-bold text-slate-500">
              Tidak ada data profil
            </p>
            <p className="text-sm text-slate-400">
              Data profil Anda tidak dapat dimuat saat ini.
            </p>
          </div>
        )}
      </Page.Body>
    </Page>
  );
}
