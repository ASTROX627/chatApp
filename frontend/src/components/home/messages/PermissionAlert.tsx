import { useTranslation } from "react-i18next"
import { useMessagePermissions } from "../../../hooks/useMessagePermissions";

const PermissionAlert = () => {
  const { isAdmin, isChannel, isMember } = useMessagePermissions();
  const { t } = useTranslation();
  return (
    <>
      {
        !isChannel && !isMember && (
          <div className="mb-2 p-2 bg-yellow-600 text-center">
            <span className="text-sm text-white">
              {t("home.notMember")}
            </span>
          </div>
        )
      }

      {
        isChannel && !isAdmin && (
          <div className="mb-2 p-2 bg-yellow-600 text-center">
            <span className="text-sm text-white">
              {t("home.onlyAdmins")}
            </span>
          </div>
        )
      }

    </>
  )
}

export default PermissionAlert
