import { useEffect } from "react";
import { FaLanguage } from "react-icons/fa";

export default function GoogleTranslate() {

  useEffect(() => {

    window.googleTranslateElementInit = () => {

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",

          includedLanguages:
            "en,hi,bn,ta,te,mr,gu,kn,ml,pa,ur,fr,es,de,ar,zh-CN,ja,ko",

          layout:
            window.google.translate.TranslateElement
              .InlineLayout.SIMPLE,
        },

        "google_translate_element"
      );
    };

    const script = document.createElement("script");

    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    script.async = true;

    document.body.appendChild(script);

  }, []);

  return (

    <div
      className="
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-2xl
      bg-white/10
      border
      border-white/10
      backdrop-blur-xl
      shadow-lg
      "
    >

      <div
        className="
        w-10
        h-10
        rounded-xl
        bg-gradient-to-br
        from-cyan-500
        to-blue-600
        flex
        items-center
        justify-center
        shadow-lg
        "
      >

        <FaLanguage className="text-white text-lg" />

      </div>

      <div>

        <p className="text-xs text-gray-400 font-bold">
          Language
        </p>

        <div id="google_translate_element"></div>

      </div>

    </div>
  );
}