const { jsonc } = require('jsonc');
const { MongoClient } = require('mongodb');
const { databaseConnectionURI } = require('../config');

exports.insertException = (errObject) => {
  MongoClient.connect(databaseConnectionURI)
    .then((db) => {
      const dbo = db.db('ByPass');
      dbo
        .collection('Exception')
        .insertOne(JSON.parse(jsonc.stringify(errObject)), (collectionErr) => {
          if (collectionErr) throw collectionErr;
        });
    })
    .catch();
};
