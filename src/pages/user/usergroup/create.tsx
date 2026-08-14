/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useUserGroup } from "@/services/usergroup/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { UserGroupForm } from "./components/UserGroupForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const UserGroupCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { create, createResult } = useUserGroup();
  const canManage = useCan(ACTION.usergroup);
  const { isLoading: isCreating, isSuccess } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Usergroup berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/usergroup");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tambah User Group"
        subtitle="Buat grup pengguna baru."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="usergroup-form"
              disabled={isCreating}
              variant="success"
            >
              {isCreating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Grup
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <UserGroupForm
          id="usergroup-form"
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
};

export default UserGroupCreatePage;
