const { jsonc } = require('jsonc');
const { MongoClient } = require('mongodb');

class ExceptionRepository {
  static insert(errObject) {
    MongoClient.connect(process.env.DATABASE_CONNECTION_URI)
      .then((db) => {
        const dbo = db.db('ByPass');
        dbo
          .collection('Exception')
          .insertOne(
            JSON.parse(jsonc.stringify(errObject)),
            (collectionErr) => {
              if (collectionErr) throw collectionErr;
            },
          );
      })
      .catch();
  }
}

module.exports = { ExceptionRepository };
