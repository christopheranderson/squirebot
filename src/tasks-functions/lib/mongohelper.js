const mongodb = require('mongodb').MongoClient;
const guid = require("guid");

const cleanObject = function(o) {
    if(!o) return o;
    delete o._id;
    return JSON.parse(JSON.stringify(o));
}

class MongoHelper {
    constructor(url) {
        this.url = url;
    }
    /**
     * 
     * @param {*} client 
     * @param {*} collection 
     * @param {*} document
     * @returns {Promise} 
     */
    upsert(collectionName, document) {
        return new Promise((res, rej) => {
            mongodb.connect(this.url, (err, db) => {
                if (err) return rej(new Error("Mongo connection issue"));

                const collection = db.collection(collectionName);

                const query = {
                    id: document.id
                };


                if (!document.id) {
                    document.id = guid.raw();
                }

                if (document.etag === "new") {
                    document.etag = guid.raw();
                } else if (document.etag) {
                    query.etag = document.etag;
                }

                collection
                    .update(query, document, { upsert: true })
                    .catch(rej).then(results => {
                        res(cleanObject(document));
                    });

                db.close();
            });
        });
    }

    get(collectionName, count, offset) {
        return new Promise((res, rej) => {
            mongodb.connect(this.url, (err, db) => {
                if (err) return rej(new Error("Mongo connection issue"));

                const collection = db.collection(collectionName);

                collection
                    .find()
                    .skip(offset)
                    .limit(count)
                    .toArray()
                    .catch(rej).then(docs => {
                        res(cleanObject(docs));
                    });

                db.close();
            })
        })
    }

    getOne(collectionName, query) {
        return new Promise((res, rej) => {
            mongodb.connect(this.url, (err, db) => {
                if (err) return rej(new Error("Mongo connection issue"));

                const collection = db.collection(collectionName);

                collection
                    .findOne(query)
                    .catch(rej).then(doc => {
                        if(!doc) return rej(new Error("Not found"));
                        res(cleanObject(doc));
                    });

                db.close();
            });
        })
    }
}

module.exports = {
    MongoHelper
}