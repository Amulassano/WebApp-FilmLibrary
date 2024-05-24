/*
 * [2023/2024]
 * Web Applications
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import FILMS from './films';

import { NavigationBar } from './components/Navbar';
import { Filters } from './components/Filters';
import { FilmTable } from './components/FilmLibrary';
import { FormRoute } from './components/Form';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom'; 
import API from './API';

function DefaultRoute(props) {
  return (
    <Container fluid>
      <p className="my-2">No data here: This is not a valid page!</p>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}

function App() {

  

  let activeFilter = 'filter-all';

  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An ID (equal to the unique name), used as key during the table generation
   * - A filter function applied before passing the films to the FilmTable component
   */
  const filters = {
    'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true,selected: 1},
    'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite, selected: 0 },
    'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5, selected: 0},
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film) , selected:0},
    'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.watchDate ? false : true, selected:0 }
  };

  const filters2 = {
    'filter-all': { label: 'All'},
    'filter-favorite': { label: 'Favorites'},
    'filter-best': { label: 'Best_Rated'},
    'filter-lastmonth': { label: 'Seen_Last_Month'},
    'filter-unseen': { label: 'Unseen'}
  };

  const isSeenLastMonth = (film) => {
    if ('watchDate' in film) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(), 'month')
      const isLastMonth = diff <= 0 && diff > -1;      // last month
      return isLastMonth;
    }
  }

  const filtersToArray = Object.entries(filters);
  //console.log(JSON.stringify(filtersToArray));

  // NB: to implicitly return an object in an arrow function, use () around the object {}
  const filterArray = filtersToArray.map( e => ({filterName: e[0], label: e[1].label, selected: e[1].selected}) );
  // alternative with destructuring directly in the parameter of the callback 
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName: filterName, label: label }));
  // or even without explicit property names, since they are the same as the name of the variable
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName, label }));
  //console.log(JSON.stringify(filterArray));

  const [delFilm, setDelFilm] = useState([])

  const [filter, setFilter] = useState(filterArray);

  const [filmList, setFilmList] = useState([]); 

  const [atcFil, setActFil] = useState(activeFilter);

  const [dirty, setDirty ] = useState(true);

  const [ errorMsg, setErrorMsg ] = useState('');

  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
    else if (err.error)
      errMsg = err.error;
        
    setErrorMsg(errMsg);

    setTimeout( ()=> setDirty(true), 2000);

  }

  useEffect(
    ()=> {
      API.getAllFilms().then((filmList) => {
        setFilmList(filmList);
       // console.log(filmList)
      })
      .catch((err) => console.log(err));
    }, []
  )

  useEffect(
    ()=> {
      API.getFilterdFilm(filters2[atcFil].label).then((filmList) => {
        setFilmList(filmList);
        setDirty(false);
      })
      .catch((err) => console.log(err));
    }, [atcFil, dirty]
  )




  function changeFilter(id){
    setFilter(
        filters => filters.map(e => ({filterName: e.filterName, label: e.label, selected: id==e.filterName? 1: 0}))
    );
   /* setFilmList(
        () => {
            return delFilm.filter(filters[id].filterFunction)}
    );*/
    setActFil(
        () => id
    )
  }

  function deleteFilm(id){
    setFilmList(
        film => {
            return film.filter(e => e.id!=id)}
    )
    API.deleteFilm(id).then(()=>{setDirty(true)})
    .catch( (err) => handleError(err));
   /* setDelFilm(
        film => {
            return film.filter(e => e.id!=id)}
    ) */
  }

  function addFilm(film) {
    setFilmList( delFilm => {
      // NB: max does not take an array but a set of parameters
      const newId = Math.max(...delFilm.map(e => e.id))+1;
      film.id = newId;
      return [...delFilm, film];
    }
    );
    
    API.addFilm(film).then(()=>{setDirty(true)})
    .catch( (err) => handleError(err));
   /* setDelFilm( delFilm => {
        // NB: max does not take an array but a set of parameters
        const newId = Math.max(...delFilm.map(e => e.id))+1;
        film.id = newId;
        return [...delFilm, film];
    }
      ); */
  }

  function saveExistingFilm(film) {
    setFilmList( filmList => 
      filmList.map( e => e.id === film.id ? film : e)
    );

    API.editFilm(film).then(()=>{setDirty(true)})
    .catch( (err) => handleError(err));
   /* setDelFilm( delFilm => 
        delFilm.map( e => e.id === film.id ? film : e)
      ); */
  }

  function changeFavorite(film) {
    setFilmList( filmList => 
      filmList.map( e => e.id === film.id ? film : e)
    );

    API.editFavorite(film).then(()=>{setDirty(true)})
    .catch( (err) => handleError(err));
   /* setDelFilm( delFilm => 
        delFilm.map( e => e.id === film.id ? film : e)
      ); */
  }

  function changeRating(film) {
    setFilmList( filmList => 
      filmList.map( e => e.id === film.id ? film : e)
    );

    API.editRating(film).then(()=>{setDirty(true)})
    .catch( (err) => handleError(err));
   /* setDelFilm( delFilm => 
        delFilm.map( e => e.id === film.id ? film : e)
      ); */
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout filter={filter} changeFilter={changeFilter} />}>
          <Route index element={ <FilmTable activeFilter={filters[atcFil].label}
            films={filmList} onDelete={deleteFilm} saveExistingFilm={saveExistingFilm} changeFavorite={changeFavorite} changeRating={changeRating}/> } />
          <Route path='/add' element={ <FormRoute addFilm={addFilm} /> } />
          <Route path='/edit/:filmId' element={<FormRoute filmList={filmList} 
            saveExistingFilm={saveExistingFilm} />} />
          <Route path = '/filter/:filter' element={ <FilmTable activeFilter={filters[atcFil].label} changeFilter={changeFilter}
            films={filmList} onDelete={deleteFilm} saveExistingFilm={saveExistingFilm} changeFavorite={changeFavorite} changeRating={changeRating}/> } />
      </Route>
      <Route path='/*' element={<DefaultRoute />} />
    </Routes>
  </BrowserRouter>

  );
}


function Layout(props){
  return(
    <Container fluid>
      <Row>
        <Col>
          <NavigationBar />
        </Col>
      </Row>
      <Row >
        <Col xs={3}>
          <Filters items={props.filter} onSelect={props.changeFilter}/>
        </Col>
        <Col>
        <Outlet />
        </Col>     
      </Row>
    </Container>
  );
}

export default App;
