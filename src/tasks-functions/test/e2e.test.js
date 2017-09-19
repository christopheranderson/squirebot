const supertest = require("supertest");
const should = require('chai').should();

const hostUrl = "http://localhost:7071";

const request = supertest(hostUrl);

describe("Task API", function () {
    describe("GET Tasks", function () {
        it("should return all tasks", function (done) {
            request
                .get(`/api/tasks`)
                .expect(200)
                .expect((res) => {
                    res.body.should.be.a("array");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                })
        })
    })

    describe("ADD Task", function () {
        it("should add a task", function (done) {
            request
                .put("/api/tasks")
                .send({
                    "title": "hello world",
                    "description": "blah blah blah",
                    "action": {
                        "type": "url",
                        "payload": {
                            "url": "http://localhost:7071/api/hello",
                            "method": "POST"
                        }
                    },
                    "parameters": []
                })
                .expect(201)
                .expect((res) => {
                    res.body.should.have.property("id");
                    res.body.should.have.property("etag");
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                })
        })
    })

    describe("GET Task", function () {
        let id = null;
        let task = null;

        before((done) => {
            request
                .get("/api/tasks")
                .end((err, res) => {
                    if (err) return done(err);

                    id = res.body[0].id;
                    task = res.body[0];
                    done();
                })

        })

        it("should return a specific task", function (done) {
            request
                .get(`/api/tasks/${id}`)
                .expect(200)
                .expect(res => {
                    res.body.should.deep.equal(task);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                })
        })
    })

    describe("UPDATE Task", function () {
        let id = null;
        let task = null;

        before((done) => {
            request
                .get("/api/tasks")
                .end((err, res) => {
                    if (err) return done(err);

                    id = res.body[0].id;
                    task = res.body[0];
                    task.title = task.title + "!!!!!!!!!!!!!"
                    done();
                })

        })

        it("should update the specified task", function (done) {
            request
                .post(`/api/tasks/${id}`)
                .send(task)
                .expect(200)
                .expect(res => {
                    res.body.should.have.property("id");
                    res.body.should.have.property("etag");
                    res.body.id.should.equal(task.id);
                    res.body.etag.should.not.equal(task.etag);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        })
    })

    describe("DELETE Task", function () {
        let id = null;
        let task = null;

        before((done) => {
            request
                .get("/api/tasks")
                .end((err, res) => {
                    if (err) return done(err);

                    id = res.body[0].id;
                    task = res.body[0];
                    done();
                })

        })

        it("should delete the specified task", function (done) {
            request
                .delete(`/api/tasks/${id}`)
                .send(task)
                .expect(204)
                .end((err, res) => {
                    if (err) return done(err);
                    request
                        .get(`/api/tasks/${id}`)
                        .expect(404)
                        .end((err, res) => {
                            if (err) return done(err);
                            done();
                        });
                });
        })
    })
})
