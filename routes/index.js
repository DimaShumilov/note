var express = require('express');
var router = express.Router();
let notes = require('../modules/notes-memory');

/* GET home page. */
router.get('/', function (req, res, next) {
  notes.keylist()
    .then(keylist => {
      "use strict";
      let keyPromises = [];

      for (let key of keylist) {
        keyPromises.push(
          notes.read(key).then(note => {
            return {key:note.key, title: note.title};
          })
        );
      }

      return Promise.all(keyPromises);
    })
    .then(notelist => {
      "use strict";
      res.render('index.pug', {title: 'Notes', notelist: notelist});
    })
    .catch(err =>{ console.error(err); next(err);});
});

module.exports = router;