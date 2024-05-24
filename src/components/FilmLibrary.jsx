import dayjs from 'dayjs';
import { Table, Form, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'; 
import { React, useState } from 'react';



function FilmTable(props) {

  const { activeFilter, films } = props;
  return (
    <>
    <div className="d-flex flex-row justify-content-between">
            <h1 className="my-2">Filter: <span>{activeFilter}</span></h1>
   <Link to ='/add'><Button variant="primary" className="my-2" >&#43;</Button></Link>
    </div>
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th className="text-center">Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
          <th>Delete/Modify</th>
        </tr>
      </thead>
      <tbody>
        {films.map((film) => <FilmRow filmData={film} key={film.id}  onDelete = {props.onDelete} editId={film.id} saveExistingFilm={props.saveExistingFilm} changeFavorite={props.changeFavorite} changeRating={props.changeRating}/>)}
      </tbody>
    </Table>
    </>
  );
}

function FilmRow(props) {

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayjs(dayJsDate).format(format) : '';
  }
  const [isChecked, setIsChecked] = useState(props.filmData.favorite ? true : false);
  const [rating, setRating] = useState(props.filmData.rating);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    
    const updatedFilm = {
      id: props.filmData.id,
      favorite: props.filmData.favorite? 0:1,
    };
    props.changeFavorite(updatedFilm);

  };

  const handleRatingChange =  (index) => {
    const newRating = index + 1;
    props.filmData.rating=props.filmData.rating ==null? 0:props.filmData.rating;
    setRating(newRating);
    console.log(props.filmData.rating)
    console.log(newRating)
    const updatedFilm = {
      id: props.filmData.id,
      deltaRating: newRating-props.filmData.rating
    };
    if(newRating!=props.filmData.rating)
      props.changeRating(updatedFilm);
  };

  return (
    <tr>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} >
          {props.filmData.title}
        </p>
      </td>
      <td className="text-center">
        <Form.Check type="checkbox" checked={isChecked}
          onChange={handleCheckboxChange}/>
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.watchdate, 'MMMM D, YYYY')}</small>
      </td>
      <td>
        <Rating maxStars={5} rating = {rating} handleRatingChange = {handleRatingChange}/>
      </td>
      <td>
      <Button className="mx-1" variant="primary" onClick={() => props.onDelete(props.filmData.id)} ><i className="bi bi-trash"></i></Button>
      <Link to={`/edit/${props.editId}`}><Button className="mx-1" variant="primary" ><i className="bi bi-pencil"></i></Button></Link>
      </td>
    </tr>
  );
}

function Rating(props) {
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} onClick={() => props.handleRatingChange(index)} style={{ cursor: 'pointer' }} />
  )
}

export { FilmTable };