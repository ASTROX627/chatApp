import { Search } from "lucide-react"
import { type FC, type JSX } from "react"
import { useTranslation } from "react-i18next";

type SearchInputProps = {
  searchTerm: string,
  setSearchTerm: (value: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({searchTerm, setSearchTerm}): JSX.Element => {
  const {t} = useTranslation();
  return (
    <div className="p-5 flex items-center gap-2">
      <div className="relative w-full">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder={t("home.search")}
          className="input input-bordered rounded-full placeholder:text-gray-400"
        />
        <Search size={20} className="absolute rtl:left-2 ltr:right-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

export default SearchInput