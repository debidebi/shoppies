import React from "react";
import styles from "./Movies.module.css";
import Button from "../Buttons/Buttons";

const Movies = (props) => {

  const imgSource =
    props.movie.Poster === "N/A"
      ? "https://www.edgeintelligence.com/wp-content/uploads/2018/08/placeholder.png"
      : props.movie.Poster;

  return (
    <div
      className={[styles.Movies, props.small ? styles.SmallMovie : ""].join(" ")}
    >
      <img src={imgSource} alt={props.movie.Title + " poster"} />
      <div className={styles.MovieInfo}>
        <h3>{props.movie.Title}</h3>
        <span>{props.movie.Year}</span>
        <Button
          click={props.clicked}
          disabled={props.disabled}
          added={props.added}
        />
      </div>
    </div>
  );
};

export default Movies;