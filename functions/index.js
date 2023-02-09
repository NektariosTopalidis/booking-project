const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'booking-project-18fb3'
});

exports.storeImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({ message: 'Not allowed.' });
    }
    const busboy = new Busboy({ headers: req.headers });
    let uploadData;
    let oldImagePath;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filePath = path.join(os.tmpdir(), filename);
      uploadData = { filePath: filePath, type: mimetype, name: filename };
      file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('field', (fieldname, value) => {
      oldImagePath = decodeURIComponent(value);
    });

    busboy.on('finish', () => {
      const id = uuid.v4();
      let imagePath = 'images/' + id + '-' + uploadData.name;
      if (oldImagePath) {
        imagePath = oldImagePath;
      }

      console.log(uploadData.type);
      return storage
        .bucket('booking-project-18fb3.appspot.com')
        .upload(uploadData.filePath, {
          uploadType: 'media',
          destination: imagePath,
          metadata: {
            metadata: {
              contentType: uploadData.type,
              firebaseStorageDownloadTokens: id
            }
          }
        })

        .then(() => {
          return res.status(201).json({
            imageUrl:
              'https://booking-project-18fb3-default-rtdb.europe-west1.firebasedatabase.app' +
              storage.bucket('booking-project-18fb3.appspot.com').name +
              '/o/' +
              encodeURIComponent(imagePath) +
              '?alt=media&token=' +
              id,
            imagePath: imagePath
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: 'Unauthorized!' });
        });
    });
    return busboy.end(req.rawBody);
  });
});
