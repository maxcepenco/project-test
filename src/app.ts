import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel.js";
import {UriParamsCourseModel} from "./models/UriParamsCourseModel";
import {CourseCreateInputModel} from "./models/CreateCourseModel";
import {CourseUpdateInputModel} from "./models/UpdateCourseModel";
import {addCoursesRoutes} from "./routes/courses";

export const app = express();
export const jsonBodyMiddleware = express.json();

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

app.use(jsonBodyMiddleware)

addCoursesRoutes(app);
app.delete('/__test__/data', (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})