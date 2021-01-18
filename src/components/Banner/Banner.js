import React from "react";
import styles from "./Banner.module.css";

const Banner = (props) => {
  // Construct list of movies shown in the banner
  let bannerMovies = "";
  if (props.topMovies) {
    bannerMovies = props.topMovies.map((m, index) => {
      return (
        <div className={styles.BannerMovie} key={index}>
          <div>#{index + 1}</div>
          <h4>
            {m.movie.Title} ({m.movie.Year})
          </h4>
        </div>
      );
    });
  }

  return (
    <div
      className={styles.BannerBackdrop}
      onClick={props.clicked}
      style={{ display: props.show ? "flex" : "none" }}
    >
      <div className={styles.Banner}>
        <h3>
          Your Final Nomination <span>🌟</span>
        </h3>
        {bannerMovies}
      </div>
    </div>
  );
};

export default Banner;
