import { type ReactNode, createContext, useContext, useState } from "react";

/**
 * LocaleContextType interface
 */
interface LocaleContextType {
  locale: string
  changeLocale: (newLocale: string) => void
}

/**
 * React context for managing locale.
 */
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/**
 * Custom hook to retrieve the locale context. 
 * @returns 
 */
export function useLocale () {
  const context = useContext(LocaleContext);
  if (context == null) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

/**
 * Provider component to wrap around components that need locale context.
 * @param param0 
 * @returns 
 */
export function LocaleProvider ({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en");

  /**
   * Function to update the locale state.
   * @param newLocale 
   */
  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  const contextValue: LocaleContextType = { locale: locale, changeLocale: changeLocale };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Component to switch between different language locales.
 * @returns 
 */
function LanguageSwitcher () {
  const { locale, changeLocale } = useLocale();

  /**
   * Function to handle the button click and change the locale accordingly.
   * @param newLocale 
   */
  const handleLanguageChange = (newLocale: string) => {
    changeLocale(newLocale);
  };

  return (
    <div>
      <button onClick={() => { handleLanguageChange("fi"); }}>FI</button>
      <button onClick={() => { handleLanguageChange("en"); }}>EN</button>
      <p>Current Locale: {locale}</p>
    </div>
  );
}

export default LanguageSwitcher;