import { useState } from 'react';
import { Button, Form, Alert, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';


function FormRoute(props) {
    return (
        <Row>
            <Col>
                <FilmForm addFilm={props.addFilm} saveExistingFilm={props.saveExistingFilm}
                  filmList={props.filmList} />
            </Col>
        </Row>
    );
}

function FilmForm(props) {
    const navigate = useNavigate();
    const { filmId } = useParams();
    //console.log(filmId);
    const objToEdit = filmId && props.filmList.find(e => e.id === parseInt(filmId));
    //console.log(objToEdit);

    const [date, setDate] = useState(objToEdit && objToEdit.watchDate ? objToEdit.watchDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
    const [title, setTitle] = useState(objToEdit ? objToEdit.title : '');
    const [favorite, setFavorite] = useState(objToEdit ? objToEdit.favorite : 0);
    const [score, setScore] = useState(objToEdit ? objToEdit.rating : 0);
    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;

        if (title === '') {
            setErrorMsg('Invalid title');
            return;
        } else if (parseInt(score) < 0 || parseInt(score) > 5) {
            setErrorMsg('Invalid rating!');
            return;
        } else if (parseInt(favorite) !== 0 && parseInt(favorite) !== 1) {
            setErrorMsg('Invalid favorite!');
            return;
        } else if (isNaN(parseInt(score))) {
            setErrorMsg('Invalid rating!');
            return;
        }

        const e = {
            title: title,
            favorite: parseInt(favorite),
            rating: parseInt(score),
            watchDate: dayjs(date)
        }

        if (objToEdit) {
            e.id = objToEdit.id;
            props.saveExistingFilm(e);
            navigate('/');
        } else {
            props.addFilm(e);
            navigate('/');
        }

        setErrorMsg('');
        form.reset(); // Resetta il form dopo l'invio

    }

    function handleScore(event) {
        setScore(event.target.value);
    }

    return (
        <>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : null}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" required name="title" value={title} onChange={(event) => setTitle(event.target.value)} isInvalid={errorMsg === 'Invalid title'} />
                    <Form.Control.Feedback type="invalid">Please provide a title.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Favorite</Form.Label>
                    <Form.Control type="number" required id="custom-switch" name="favorite" value={favorite} onChange={(event) => setFavorite(event.target.value)} isInvalid={errorMsg === 'Invalid favorite!'} />
                    <Form.Control.Feedback type="invalid">Please provide a valid favorite.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" required name="date" value={date} onChange={(event) => setDate(event.target.value)} />
                    <Form.Control.Feedback type="invalid">Please provide a valid date.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control type="number" required name="score" value={score} onChange={handleScore} isInvalid={errorMsg === 'Invalid rating!'} />
                    <Form.Control.Feedback type="invalid">Please provide a valid rating.</Form.Control.Feedback>
                </Form.Group>

                <Button type='submit' variant="primary">{objToEdit ? 'Save' : 'Add'}</Button>
                <Button variant='warning' onClick={()=>{navigate('/')}}>Cancel</Button>
            </Form>
        </>
    );
}

export { FormRoute }

