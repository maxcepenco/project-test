import request from 'supertest';
import { app, HTTP_STATUSES } from "../../src";
import {CourseCreateInputModel} from "../../src/models/CreateCourseModel";
import {CourseUpdateInputModel} from "../../src/models/UpdateCourseModel";

describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data');
    });

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/9999999')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it(`should not create course with incorrect input data`, async () => {
        const data: CourseCreateInputModel = { title: '' };
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    let createCourse1:any = null;
    it(`should create course with correct input data`, async () => {
        const data: CourseCreateInputModel = {title: 'it-incubator'};
        const createResponse =  await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATE_201);

        createCourse1 = createResponse.body;

        expect(createCourse1).toEqual({
            id: expect.any(Number),
            title: 'it-incubator',
        });

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createCourse1]);
    });

    let createCourse2:any = null;
    it(`should create more course`, async () => {

        const data: CourseCreateInputModel = { title: 'it-incubator course 2' };
        const createResponse =  await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATE_201);

        createCourse2 = createResponse.body;

        expect(createCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        });

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createCourse1, createCourse2]);
    });

    it(`should not update course with incorrect input data`, async () => {

        const data: CourseUpdateInputModel = { title: '' };

        await request(app)
            .put('/courses/' + createCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get('/courses/' + createCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createCourse1);
    });

    it(`should not update course that not exist`, async () => {
        const data: CourseUpdateInputModel = { title: 'good title' };
        await request(app)
            .put('/courses/' + -2222)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it(`should update course`, async () => {
        const data:CourseUpdateInputModel = { title: 'good new title' };
        await request(app)
            .put('/courses/' + createCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createCourse1.id)
            .expect(HTTP_STATUSES.OK_200, { ...createCourse1, title: 'good new title' });

        await request(app)
            .get('/courses/' + createCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createCourse2);
    });

    it(`should delete both courses`, async () => {
        await request(app)
            .delete('/courses/' + createCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .delete('/courses/' + createCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });
});
