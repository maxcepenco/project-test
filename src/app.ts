import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel.js";
import {UriParamsCourseModel} from "./models/UriParamsCourseModel";
import {CourseCreateInputModel} from "./models/CreateCourseModel";
import {CourseUpdateInputModel} from "./models/UpdateCourseModel";

export const app = express();
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATE_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
export type CourseType = {
    id: number;
    title: string
    studentsCount: number
}
export const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automotion qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10},
    ]
}
export const getCourseViewModel = (dbCourse: CourseType) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
    }
}

app.get('/courses', (req:RequestWithQuery<QueryCoursesModel>, res:Response<CourseViewModel[]>) => {
    let foundCourses = db.courses
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)

    }
    res.json(foundCourses.map(getCourseViewModel))
})

app.get('/courses/:id', (req: RequestWithParams<UriParamsCourseModel>, res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(getCourseViewModel(foundCourse));
})


app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createdCourse)
    res
        .status(HTTP_STATUSES.CREATE_201)
        .json(getCourseViewModel(createdCourse));
})

app.delete('/courses/:id', (req: RequestWithParams<UriParamsCourseModel>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req: RequestWithParamsAndBody<UriParamsCourseModel, CourseUpdateInputModel>, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if (!foundCourse) {
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