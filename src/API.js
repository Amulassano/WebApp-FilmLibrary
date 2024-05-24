'use strict'

import {Film} from "./FilmModel.js";

const URL = "http://localhost:3001/api";

async function getAllFilms(){
    const response = await fetch(URL+'/films');
    const filmList = await response.json();

    if (response.ok) {
        return filmList.map((e)=> new Film(e.id, e.title, e.favorite, e.watchdate, e.rating));
    } else {
        throw filmList;
    }
}
const options = {
    method: 'DELETE', // Specifica il metodo della richiesta come DELETE
    headers: {
      'Content-Type': 'application/json', // Specifica il tipo di contenuto se necessario
      // Altri eventuali header possono essere specificati qui
    },
    // Se è necessario inviare dati nel corpo della richiesta, possono essere inclusi qui
    // body: JSON.stringify(data)
  };

async function deleteFilm(id){
    const response = await fetch(URL+`/films/${id}/delete`,options);
    const deleted = await response.json();
    console.log(deleted);
    if (deleted == "Film deleted correctly!") {
        return true;
    } else {
        throw deleted;
    }
}

async function getFilterdFilm(id){
    const response = await fetch(URL+`/films/filter?${id}=1`);
    const filmList = await response.json();

    if (response.ok) {
        return filmList.map((e)=> new Film(e.id, e.title, e.favorite, e.watchdate, e.rating));
    } else {
        throw filmList;
    }
}

function addFilm(film){
    return new Promise(
        (resolve, reject) => {
            fetch(URL +`/films`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Object.assign({}, film, {watchDate: film.watchDate.format("YYYY-MM-DD")}))
            }).then((response) => {
                if (response.ok) {
                  response.json()
                    .then((id) => resolve(id))
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                } else {
                  // analyze the cause of error
                  response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        }
    );
}

function editFilm(film){
    return new Promise(
        (resolve, reject) => {
            fetch(URL +`/films/${film.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Object.assign({}, film, {watchDate: film.watchDate.format("YYYY-MM-DD")}))
            }).then((response) => {
                if (response.ok) {
                  response.json()
                    .then((id) => resolve(id))
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                } else {
                  // analyze the cause of error
                  response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        }
    );
}

function editFavorite(film){
    return new Promise(
        (resolve, reject) => {
            fetch(URL +`/films/${film.id}/favorite`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Object.assign({}, film))
            }).then((response) => {
                if (response.ok) {
                  response.json()
                    .then((id) => resolve(id))
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                } else {
                  // analyze the cause of error
                  response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        }
    );
}

function editRating(film){
    return new Promise(
        (resolve, reject) => {
            fetch(URL +`/films/change-rating`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Object.assign({}, film))
            }).then((response) => {
                if (response.ok) {
                  response.json()
                    .then((id) => resolve(id))
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                } else {
                  // analyze the cause of error
                  response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        }
    );
}

const API = {getAllFilms, deleteFilm, getFilterdFilm, addFilm, editFilm,deleteFilm, editFavorite, editRating}

export default API;