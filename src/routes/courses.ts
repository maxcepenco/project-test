import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {Express, Response} from "express";
import {CourseViewModel} from "../models/CourseViewModel.js";
import {UriParamsCourseModel} from "../models/UriParamsCourseModel";
import {CourseCreateInputModel} from "../models/CreateCourseModel";
import {CourseUpdateInputModel} from "../models/UpdateCourseModel";
import { CourseType, db, getCourseViewModel, HTTP_STATUSES} from "../app";


export const addCoursesRoutes = (app: Express) => {
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


}