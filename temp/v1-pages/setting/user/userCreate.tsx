import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { UserForm, type UserFormData } from "./components/userForm";

export function UserCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useUser();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "User berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/user");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: UserFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tambah User"
        subtitle="Registrasikan pengguna sistem baru."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="user-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan User
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <UserForm id="user-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}

export default UserCreate;
