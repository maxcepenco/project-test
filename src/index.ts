import express,{Request,Response} from 'express';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";

export const app = express();
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export const HTTP_STATUSES = {
    OK_200:200,
    CREATE_201:201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400:400,
    NOT_FOUND_404: 404
}

type CourseType = {
    id: number;
    title: string
}


export const db: {courses:CourseType[]}  = {
    courses:[
        {id:1, title: 'front-end'},
        {id:2, title: 'back-end'},
        {id:3, title: 'automotion qa'},
        {id:4, title: 'devops'},
    ]
}


app.get('/courses', (req:RequestWithQuery<{title: string}>, res:Response<CourseType[]>) => {
    let foundCourses = db.courses
        if(req.query.title) {
            foundCourses =foundCourses.filter( c => c.title.indexOf(req.query.title as string) > -1 )

        }
    res.json(foundCourses);
})


app.get('/courses/:id', (req:RequestWithParams<{id:string}>, res:Response) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
})


app.post('/courses', (req:RequestWithBody<{title:string}>, res:Response<CourseType>) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(createdCourse)
    res
        .status(HTTP_STATUSES.CREATE_201)
        .json(createdCourse);
})

app.delete('/courses/:id', (req:RequestWithParams<{id:string}>, res) => {
  db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req:RequestWithParamsAndBody<{id:string},{title:string}>, res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/__test__/data', (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

    app.listen(port, () => {
        console.log(`Listening on ${port}...`);
    })
