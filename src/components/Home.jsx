import React from "react";
import TypingText from "./TypingText";
import { useLanguage } from "@/context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <TypingText
        className="text-[16vw] md:text-[22vw] text-redy font-semibold"
        text={t.home.mainText}
        speed={0.35}
        delay={2}
      />
    </div>
  );
};

export default Home;
