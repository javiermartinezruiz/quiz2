import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const uri = `mongodb+srv://quiz:quiz1234@douglascsis3380project.kcjttmj.mongodb.net/Exams23001?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  sid: {
    type: String,
  },
});

const Document = mongoose.model("Quizexamrecords", documentSchema);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/documents/", (request, response) => {
  Document.find({})
    .then((users) => response.json(users))
    .catch((err) => response.status(400).json("Error: " + err));
});

app.post("/documents", (request, response) => {
  if (request.body.sid === undefined) {
    return response.status(400).json({ message: "Verify sid" });
  }

  if (request.body.name === undefined) {
    return response.status(400).json({ message: "Verify name" });
  }

  const sid = request.body.sid;
  const name = request.body.name;

  new Document({ sid: sid, name: name })
    .save()
    .then((res) => {
      return response.status(201).json({ message: "Document created." });
    })
    .catch((err) => response.status(400).json({ message: err }));
});

app.listen(port, () => {
  console.log("Express is running...");
});
