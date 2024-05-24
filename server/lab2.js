"use strict";


function Film(id,title,favorites, date, rating){
    this.id = id;
    this.title = title;
    this.favorites = favorites;
    this.date = date;
    this.rating = rating;
}

function FilmLibrary(){
    this.array = [];
    
    this.addNewFilm = (film) =>{
        this.array.push(film);
    }

    this.printFilms = ()=>{
        for(let el of this.array){
            console.log(el);
        }
    }

    this.sortByDate = () =>{
            return [...this.array].sort((a,b) => 
            {if(a.date === undefined && b.date===undefined){
                return 0;}
            if (a.date === undefined){
                return 1;}
            if(b.date === undefined){
                return -1;
            }
            else{
                return a.date.diff(b.date);
            }
            });
    }

    this.deleteFilm = (id) => {
        this.array=this.array.filter((el) => el.id != id)
    }

    this.resetWatchedFilms = ()=>{
        this.array.forEach((el)=>el.date = undefined)
    }

    this.getRated = () =>{
        return this.array.filter((el)=> el.rating!==undefined)
    }

    this.readFilms = (sql)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films";
            sql.all(sel, (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getFav = (sql)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE favorite=1";
            sql.all(sel, (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getBestFilms = (sql)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE rating=5";
            sql.all(sel, (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getLastMonth = (sql)=>{
        const dayjs = require('dayjs');
        const today = dayjs();
        const last = today.subtract(30, 'day');
        console.log(last.format('YYYY-MM-DD'))
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE Watchdate > ?";
            sql.all(sel,[last.format('YYYY-MM-DD')], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getUnseen = (sql)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE Watchdate IS NULL";
            sql.all(sel, (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getWatchedToday = (sql,date)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE Watchdate=?";
            sql.all(sel,[date], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getEarlierWatchedToday = (sql,date)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE Watchdate<?";
            sql.all(sel,[date], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getRating = (sql,rate)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE rating>=?";
            sql.all(sel,[rate], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getTitle = (sql,title)=>{
        return new Promise((res, rej)=>{
            const tit = '%' + title +'%';
            let sel = "SELECT * FROM films WHERE Title LIKE ?";
            sql.all(sel,[tit], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getName = (sql,id)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT * FROM films WHERE id = ?";
            sql.all(sel,[id], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows);
                }
            });
        });
    }

    this.getRatingName = (sql,id)=>{
        return new Promise((res, rej)=>{
            let sel = "SELECT rating FROM films WHERE id = ?";
            sql.all(sel,[id], (err,rows)=>{
                if (err) rej(err);
                else{
                    res(rows[0].rating);
                }
            });
        });
    }

    this.storeFilm = (sql, film)=>{
        return new Promise((res,rej) =>{
        let ins = "INSERT INTO films(title, favorite, watchdate, rating) VALUES  (?, ?, ? ,?) ";
        sql.run(ins, [film.title,film.favorite,film.watchdate,film.rating], function(err){
            if(err) rej(err);
            else{
                console.log("Film inserted correctly!");
                res(film);
            }
        })
    })
    }

    this.deleteFilm = (sql, id)=>{
        return new Promise((res,rej)=>{
         let ins = "DELETE FROM films WHERE id= ?";
         sql.run(ins, [id], function(err){
             if(err) rej(err);
             else{
                 res("Film deleted correctly!");
             }
            })
         })
    }

    this.deleteWatchdate = (sql)=>{
         let ins = "UPDATE films SET watchdate =  NULL";
         sql.run(ins,  function(err){
             if(err) throw err;
             else{
                 console.log("Watchdate deleted correctly!");
             }
         })
    }

    this.changeFav = (sql, id,fav)=>{
        return new Promise((res,rej)=>{
        let ins = "UPDATE films SET favorite = ? WHERE id = ?";
        sql.run(ins,[fav, id],  function(err){
            if(err) rej(err);
            else{
                console.log("Watchdate deleted correctly!");
                res("Favorite changed!");
            }
        })
        })
   }

    this.changeRate = (sql, id,rate)=>{
    return new Promise((res,rej)=>{
    let ins = "UPDATE films SET rating = rating + ? WHERE id = ? AND rating IS NOT NULL";
    sql.run(ins,[rate, id],  function(err){
        if(err) rej(err);
        else{
            res("Rate changed!");
        }
    })
    });
}

    this.changeFilm = (sql, film)=>{
        console.log(film)
        return new Promise((res,rej)=>{
        let ins = "UPDATE films SET title = ? ,favorite = ?, watchdate = ?, rating = ? WHERE id = ? ";
        sql.run(ins,[film.title,film.favorite,film.watchDate,film.rating,film.id],  function(err){
            if(err) rej(err);
            else{
                console.log("Film changed correctly!");
                res(film);
            }
        })
    });
}
}

module.exports = {
    FilmLibrary: FilmLibrary
}


const dayjs = require('dayjs');
const sqlite = require('sqlite3');
//const db = new sqlite.Database('films_copy.db',(err)=>{if (err) throw err;});
/*
let sql = "SELECT * FROM films";
db.all(sql, (err,rows)=>{
    if(err) throw err;
    for(let row of rows){
        console.log(row);
    }
}) */

const date1 = dayjs('2023-03-10');
const date2 = dayjs('2023-03-17');
const date3 = dayjs('2023-03-21');
/*
const filmL = new FilmLibrary();
async function getFilms(){
    const films = await filmL.readFilms(db);
    const array = []
    for(let film of films){
        array.push(film);
    }
    //console.log(films);
    return array;
}/*
filmL.readFilms(db).then((films) =>{  
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});*/
//const arr = getFilms();
//console.log(arr);
/*
filmL.getFav(db).then((films) =>{
    const array = [];
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});
filmL.getWatchedToday(db,'2023-03-10').then((films) =>{
    const array = [];
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});
filmL.getEarlierWatchedToday(db,'2023-03-18').then((films) =>{
    const array = [];
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});
filmL.getRating(db,4).then((films) =>{
    const array = [];
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});
filmL.getTitle(db,'Pulp').then((films) =>{
    const array = [];
    for(let film of films){
        array.push(film);
    }
    //console.log(array);
    return array;
    
});*/
//filmL.storeFilm(db, 6, 'Avengers', 1, '2024-01-15', 5);
//filmL.deleteFilm(db, 5);
//filmL.deleteWatchdate(db);

/*

filmL.addNewFilm(new Film(1, "Pulp Fiction", true, date1, 5));
filmL.addNewFilm(new Film(2,"21 Grams",true, date2, 4));
filmL.addNewFilm(new Film(3, "StarWars", false));
filmL.addNewFilm(new Film(4, "Matrix", false));
filmL.addNewFilm(new Film(5,"Shrek",false,date3,3)); */

//const sortedFilm = filmL.sortByDate();
//filmL.printFilms();console.log(sortedFilm);

//filmL.deleteFilm(1);
//filmL.printFilms();

//filmL.resetWatchedFilms();
//filmL.printFilms();

//const rate = filmL.getRated();
//console.log(rate);