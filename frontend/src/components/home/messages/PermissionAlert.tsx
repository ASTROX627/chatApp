import { useTranslation } from "react-i18next"

const PermissionAlert = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-2 p-2 bg-yellow-600 text-center">
      <span className="text-sm text-white">
        {t("home.onlyAdmins")}
      </span>
    </div>
  )
}

export default PermissionAlert
