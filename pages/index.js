
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import Head from "next/head";
import Script from "next/script";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

const resources = {
  sk: {
    translation: {
      searchPlaceholder: "Hľadať produkt",
      language: "Jazyk",
    },
  },
  cs: {
    translation: {
      searchPlaceholder: "Hledat produkt",
      language: "Jazyk",
    },
  },
  en: {
    translation: {
      searchPlaceholder: "Search product",
      language: "Language",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "sk",
  fallbackLng: "sk",
  interpolation: { escapeValue: false },
});

export default function Home() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("sk");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const data = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${lang}`).then(r => r.json());
    setResults(data.items);
    setLoading(false);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <>
      <Head>
        <title>CenyOnline.sk – {t('searchPlaceholder')}</title>
      </Head>

      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
        crossOrigin="anonymous"
      />

      <main className="min-h-screen p-4 bg-gray-50 flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-6">
          CenyOnline.sk
        </motion.h1>

        <div className="flex gap-2 mb-6 w-full max-w-xl">
          <Input
            className="flex-1"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
          <Select value={lang} onValueChange={setLang}>
            <SelectItem value="sk">SK</SelectItem>
            <SelectItem value="cs">CZ</SelectItem>
            <SelectItem value="en">EN</SelectItem>
          </Select>
        </div>

        <div className="mb-4">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="YOUR_ADSENSE_CLIENT_ID"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>

        <section className="grid gap-4 w-full max-w-4xl">
          {results.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.shopName}</p>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <span className="text-2xl font-bold">{item.price} €</span>
                  <a href={item.url} target="_blank" rel="noopener" className="text-blue-600 underline text-sm mt-1">{lang === 'en' ? 'Buy' : lang === 'cs' ? 'Koupit' : 'Kúpiť'}</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {loading && <Loader2 className="animate-spin mt-8" />}
      </main>

      <Script id="adsbygoogle-init" strategy="afterInteractive">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
    </>
  );
}
