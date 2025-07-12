import type { ChangeEvent } from "react";
import { useAppContext } from "../../../../../context/app/appContext"
import { useTranslation } from "react-i18next";

const SelectLanguage = () => {
  const {language, changeLanguage} = useAppContext();
  const {t} = useTranslation();

  const languages = [
    {value: "en", label: t("home.languages.en")},
    {value: "fa", label: t("home.languages.fa")}
  ];

  const handleChangeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    if(selectedLanguage === "en" || selectedLanguage === "fa"){
      changeLanguage(selectedLanguage)
    }
  }
  return (
    <select
      value={language}
      onChange={handleChangeLanguage}
      className={`select mt-5`}
    >
      <option disabled={true}>{t("home.selectLanguage")}</option>
      {
        languages.map((language) => (
          <option key={language.value} value={language.value}>{language.label}</option>
        ))
      }
    </select>
  )
}

export default SelectLanguage
