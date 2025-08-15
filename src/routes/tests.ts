import {DBType} from "../db/db";
import {Express} from "express";
import {HTTP_STATUSES} from "./courses";


export const addTestsRoutes = (app:Express, db:DBType) => {
    app.delete('/__test__/data', (req, res) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
}