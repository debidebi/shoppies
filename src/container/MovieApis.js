import React, { Component } from "react";
import Movies from "../components/Movies/Movies";
import styles from "./MovieApis.module.css";
import Banner from "../components/Banner/Banner";
// import FontAwesome from 'react-fontawesome';
// import faStyles from 'font-awesome/css/font-awesome.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import axios from "axios";
//library.add(fab, faFilm, faTrashAlt);

class MovieApis extends Component {
  state = {
    searchedMovies: [],
    nominatedMovies: [],
    currentInput: "",
    searchedLoading: false,
    nominatedLoading: false,
    searchError: "",
    bannerShowing: false
  };

  componentDidMount() {  
    axios
      .get("https://the-shoppies-challenge.firebaseio.com/nominations.json")
      .then((response) => {
        if (response.data) {
          this.setState({
            nominatedMovies: Object.keys(response.data).map(
              (key) => response.data[key]
            )
          });
        }
        this.setState({ nominatedLoading: false });
      })
      .catch((err) => console.log(err));
  }

  
  handleSearch = (event) => {
    this.setState({
      currentInput: event.target.value,
      searchedLoading: true
    });
    axios
      .get(
        `https://www.omdbapi.com/?s=${event.target.value}&type=movie&apikey=81cf6f48`
      )
      .then((response) => {
        if (response.data.Response !== "False") {
          this.setState({
            searchedMovies: response.data.Search.slice(0, 10),
            searchedLoading: false,
            searchError: ""
          });
        } else {
          this.setState({
            searchedMovies: [],
            searchedLoading: false,
            searchError: response.data.Error
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addMovieHandler = (movie) => {
    const prevNominatedMovies = [...this.state.nominatedMovies];

  
    const timestampedMovie = {
      movie: movie,
      dateAdded: new Date()
    };

    
    this.setState(
      {
        nominatedMovies: prevNominatedMovies.concat(timestampedMovie)
      },
      () => {
        axios
          .post(
            "https://the-shoppies-challenge.firebaseio.com/nominations.json",
            timestampedMovie
          )
          .catch((err) => console.log(err));
        if (this.state.nominatedMovies.length >= 5) {
          this.setState({ bannerShowing: true });
        }
      }
    );
  };

  removeMovieHandler = (id) => {
    const prevNominatedMovies = [...this.state.nominatedMovies];
    const newNominatedMovies = prevNominatedMovies.filter(
      (movie) => movie.movie.imdbID !== id
    );
    this.setState(
      {
        nominatedMovies: newNominatedMovies
      },
      () => {
       
        axios
          .delete(
            "https://the-shoppies-challenge.firebaseio.com/nominations.json"
          )
          .then((res) => {
           
            axios.all([
              newNominatedMovies.map((movie) => {
                return axios
                  .post(
                    "https://the-shoppies-challenge.firebaseio.com/nominations.json",
                    movie
                  )
                  .catch((err) => console.log(err));
              })
            ]);
          })
          .catch((err) => console.log(err));
      }
    );
  };


  bannerClickedHandler = () => {
    this.setState({
      bannerShowing: false
    });
  };

  render() {
    
    const isAlreadyNominated = (movie) => {
      let nominated = false;
      for (let m of this.state.nominatedMovies) {
        if (m.movie.imdbID === movie.imdbID) {
          nominated = true;
        }
      }
      return nominated;
    };

    
    const currentShowedMovies = this.state.searchedMovies.map((movie) => {
      return (
        <Movies          
         movie={movie}
          key={movie.imdbID}
          disabled={
            isAlreadyNominated(movie) || this.state.nominatedMovies.length >= 5
          }
          clicked={() => this.addMovieHandler(movie)}
        />
      );
    });

    
    const currentNominatedMovies = this.state.nominatedMovies.map((m) => {
      return (
        < Movies          
          movie={m.movie}
          added
          small
          key={m.movie.imdbID}
          disabled={false}
          clicked={() => this.removeMovieHandler(m.movie.imdbID)}
        />
      );
    });

    return (
      <div className={styles.MovieApis}>
        <div className={[styles.SearchSection, styles.Section].join(" ")}>
          <h1>
            <i className="fas fa-film"></i>
            <FontAwesomeIcon icon="film" />
            <span>SHOPPIES CHALLENGE</span>
          </h1>
      
          <form>
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
              onChange={this.handleSearch}
            />
          </form>

          <div className={styles.MoviesShow}>
            {this.state.currentInput ? (
              <h2>Results for "{this.state.currentInput}"</h2>
            ) : (
              <h2>Search for movies!</h2>
            )}
            {this.state.searchError &&
            this.state.searchError !== "Incorrect IMDb ID." ? (
              <p>{this.state.searchError}</p>
            ) : (
              <div className={styles.MovieGrid}>{currentShowedMovies}</div>
            )}
          </div>
        </div>

        <div
          className={[styles.NominationsSection, styles.Section].join(" ")}
        >
          <h1 className="d-none-md">
            <i className="fas fa-film"></i>
            <span>SHOPPIES CHALLENGE</span>
          </h1>
          <h2>Nominations ({this.state.nominatedMovies.length}/5)</h2>
          {this.state.nominatedLoading ? (
            <p>Loading...</p>
          ) : (
            <div>{currentNominatedMovies}</div>
          )}
          <Banner
            topMovies={this.state.nominatedMovies}
            clicked={this.bannerClickedHandler}
            show={this.state.bannerShowing}
          />
        </div>
      </div>
    );
  }
}

export default MovieApis;
