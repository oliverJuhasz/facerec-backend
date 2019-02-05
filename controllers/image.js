const Clarifai =require( "clarifai");

const app = new Clarifai.App({
    apiKey: "e24c578150804dbf9b21a7d6c98014e8"
  });

const handleApiCall = (req, res) => {
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input)
      .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("Unable to work with API"))
  }
    


const image = (req, res, db) => {
    const { id } = req.body;
    db("users").where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("unable to get entries"))

    };

module.exports = {
    handleImage : image,
    handleApiCall : handleApiCall
}