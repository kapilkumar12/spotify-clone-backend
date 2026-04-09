const express = require('express')
const musicController = require('../controllers/music.controller')
const multer = require('multer')
const authMiddleware = require('../middlewares/auth.middleware')


const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/upload', authMiddleware.authArtistMiddleware, upload.single('music'), musicController.createMusic)
router.post('/album', authMiddleware.authArtistMiddleware, musicController.addMusicToAlbum)

router.get('/', authMiddleware.authUserMiddleware, musicController.getAllMusics)
router.get('/albums', authMiddleware.authUserMiddleware, musicController.getAllAlbums)
router.get('/album/:albumId', authMiddleware.authUserMiddleware, musicController.getAlbumById)

module.exports = router