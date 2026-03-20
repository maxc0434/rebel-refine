import React from "react";
import { useLanguage } from "../translations/hooks/useLanguage";
import "./Loader.css";

const Loader = ({ fullscreen = true }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`rebel-preloader ${fullscreen ? "is-fullscreen" : "is-inline"}`}
    >
      <div className="preloader-inner">
        <div className="loader-orbit-spinner">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit orbit-three"></div>
        </div>
        <p className="loader-text">{t.loading_universe}</p>
      </div>
    </div>
  );
};

export default Loader;
