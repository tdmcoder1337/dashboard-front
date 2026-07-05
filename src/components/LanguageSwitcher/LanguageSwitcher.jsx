import { FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../../context/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <label className="language-switcher" aria-label="Language">
      <FaGlobe />
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        <option value="uz">UZB</option>
        <option value="ru">RUS</option>
      </select>
    </label>
  )
}

export default LanguageSwitcher
