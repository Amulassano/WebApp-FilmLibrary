'use strict'

const express = require('express');
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const cors = require('cors');

const lab2 = require('./lab2.js').FilmLibrary;
const sqlite = require('sqlite3');
const db = new sqlite.Database('films_2.db',(err)=>{if (err) throw err;});


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// GET /api/films

const films = new lab2();

app.use('/static', express.static('./public'));
/*

app.get('/api/films', (req,res) => {
    films.readFilms(db).then(film => res.json(film)).catch(()=>res.status(500).end());
}); 
*/
app.get('/api/films', async (req,res) =>{
    try {
        const filmList = await films.readFilms(db);
        if (filmList.error)
            res.status(404).end();
        else{
            const resultsPurified = filmList.map(e => Object.assign({}, e, {title: DOMPurify.sanitize(e.title)}));
            console.log(resultsPurified);
            res.json(resultsPurified); 
        }
    } catch (err) {
        res.status(500).end();
    }
})


app.get('/api/films/:id/name', async (req,res) =>{
    try {
        const resultID = await films.getName(db,req.params.id);
        if (Object.keys(resultID).length === 0)
        res.status(404).json(`Id not found`);
        else
        res.json(resultID);
    } catch (err) {
        res.status(500).end();
    }
});


app.post('/api/films',[
    check('title').isString(),
    check('favorite').isBoolean(),
    check('watchDate').isDate(),
    check('rating').isInt({min: 0, max: 5})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    }
    try {
        const film = {
            title: req.body.title,
            favorite: req.body.favorite,
            watchdate: req.body.watchDate,
            rating: req.body.rating,
        }
        console.log(film)
        const stored = await films.storeFilm(db,film);
        res.json(stored);
    } catch (err) {
        res.status(500).end();
    }
}); 


app.put('/api/films/:id/favorite',[
    check('id').isInt({min: 1}),
    check('favorite').isBoolean()
], async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    } 
    const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }
    try {
        const id = await films.getName(db,filmId);
        if(id.error)
            return res.status(404).json(id);
        
        const fav = await films.changeFav(db,req.body.id,req.body.favorite);
        return res.json(fav);
    } catch (err) {
        res.status(500).end();
    }
    
});

app.post('/api/films/change-rating',[
    check('id').isInt({min:0})
], async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    } 
    const rating = await films.getRatingName(db,req.body.id);
    const rate = req.body.deltaRating;
    console.log(rating);
    if(rate > 0 && rating ==5 || rate < 0 && rating ==0)
        return res.status(422).json(rating);
    try {
        const result = await films.changeRate(db,req.body.id,req.body.deltaRating);
        return res.json(result)
    } catch (err) {
        res.status(500).end();
    }
    
});

app.delete('/api/films/:id/delete', (req,res) =>{
    films.deleteFilm(db,req.params.id).then(film => res.json(film)).catch(()=>res.status(500).end());
});


app.get('/api/films/filter', (req,res)=>{
    const fav = req.query.Favorites;
    const best = req.query.Best_Rated;
    const last = req.query.Seen_Last_Month;
    const unseen = req.query.Unseen;
    const all = req.query.All;
    if(fav){
        films.getFav(db).then(film => res.json(film)).catch(()=>res.status(500).end());
    }
    else if(best){
        films.getBestFilms(db).then(film => res.json(film)).catch(()=>res.status(500).end());
    }
    else if(last){
        films.getLastMonth(db).then(film => res.json(film)).catch(()=>res.status(500).end());
    }
    else if(unseen){
        films.getUnseen(db).then(film => res.json(film)).catch(()=>res.status(500).end());
    }
    else if (Object.keys(req.query).length == 0 || all){
        films.readFilms(db).then(film => res.json(film)).catch(()=>res.status(500).end()); 
    }
    else{
        res.status(500).end();
    }
});

app.put('/api/films/:id',[
    check('id').isInt({min: 1}),
    check('title').isString(),
    check('favorite').isBoolean(),
    check('watchDate').isDate().optional(),
    check('rating').isInt({min: 0, max: 5})
], async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    }
    
    const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }
    try {
        const id = await films.getName(db,filmId);
        if(id.error)
            return res.status(404).json(id);
        const film = {
                id : req.params.id,
                title: req.body.title ,
                favorite: req.body.favorite ,
                watchDate: req.body.watchDate,
                rating: req.body.rating,
            };
        const changing = await films.changeFilm(db, film);
        return res.json(changing);
    } catch (error) {
        res.status(500).end();
    }
});


app.listen(3001, () => console.log('Server ready'));