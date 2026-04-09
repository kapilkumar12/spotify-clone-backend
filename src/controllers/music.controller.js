const musicModel = require('../models/music.model')
const { uploadFile } = require('../services/storage.service')
const albumModel = require('../models/album.model')


async function createMusic(req,res) {

  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: "Music file is required"
    });
  }

  try {

    const result = await uploadFile(file.buffer.toString("base64"))

    const music = await musicModel.create({
      url: result.url,
      title,
      artist: req.user.id
    })

    res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        url: music.url,
        title: music.title,
        artist: music.artist
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Music upload failed",
      error: error.message
    });
  }

}

async function addMusicToAlbum(req,res) {

  try {
    const { title,musics } = req.body;
    const album = await albumModel.create({
      title,
      musics: musics,
      artist: req.user.id
    })

    res.status(201).json({
      message: "Music added to album successfully",
      album: {
        id: album._id,
        title: album.title,
        musics: album.musics,
        artist: album.artist
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Failed to add music to album",
      error: error.message
    })
  }

}

async function getAllMusics(req, res){

try {
  const musics = await musicModel.find().limit(20).populate('artist', "username")
  res.status(200).json({
    message: "Musics fetched successfully",
    musics 
  })
} catch (error) {
  res.status(500).json({
    message: "Failed to fetch musics",
    error: error.message
  })
}

}

async function getAllAlbums(req, res){

try {
const albums = await albumModel.find().select("title artist").populate('artist', "username email")
res.status(200).json({
  message:"Albums fetched successfully",
  albums:albums
})

} catch (error) {

  return res.status(500).json({
    message:"Album fetched error",
    error: error.message
  })
  
}

}

async function getAlbumById(req,res) {
  try {

    const albumId = req.params.id;

    const album = await albumModel.findById(albumId).populate('musics').populate('artist', "username email")
    
    if (!album) {
      return res.status(404).json({
        message: "Album not found"
      })
    }

    res.status(200).json({
      message:"Album musics fetched successfully",
      album: {
        id: album._id,
        title: album.title,
        musics: album.musics,
        artist: album.artist
      }
    })

  } catch (error) {
    return res.status(500).json({
      message:"Album musics fetched error",
      error: error.message
    }
    )
    
  }
}


module.exports = { createMusic,addMusicToAlbum, getAllMusics, getAllAlbums, getAlbumById }