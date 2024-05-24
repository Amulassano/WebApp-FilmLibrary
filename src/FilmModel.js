'use strict'

import dayjs from 'dayjs';


function Film(id,title,favorite, watchdate, rating){
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watchdate = (watchdate==null)?undefined : dayjs(watchdate).format('YYYY-MM-DD');
    this.rating = rating;
}

export {Film};