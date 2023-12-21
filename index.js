import express from "express";
import { connect, Schema as _Schema, model } from "mongoose";
import cors from "cors";

await connect(
  "mongodb+srv://valentin:sSD00Gh9S7kEsBIA@clustersubasta.iuhqixc.mongodb.net/"
);

const Schema = _Schema;
const ClimaSchema = new Schema({
  mov: Boolean,
  lugar: String,
  fecha: Date,
});
const Clima = model("Clima", ClimaSchema);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/clima", async (req, res) => {
  const data = req.body;
  try {
    const newClima = new Clima({ ...data, fecha: new Date().toISOString() });
    await newClima.save();
    res.send({ res: "Clima creado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el clima.");
  }
});
//obtener el ultimo clima
app.get("/clima", async (req, res) => {
  try {
    const totalDocuments = await Clima.countDocuments();
    let clima = await Clima.findOne().sort({ _id: -1 }).limit(1);
    clima = { ...clima._doc, totalDocuments };
    res.json(clima);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el clima.");
  }
});
//borrar todo el clima
app.delete("/clima", async (req, res) => {
  try {
    await Clima.deleteMany();
    res.send("Clima borrado exitosamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al borrar el clima.");
  }
});
//obtener todos los climas de un lugar
app.get("/clima/:lugar", async (req, res) => {
  try {
    const { lugar } = req.params;
    const climas = await Clima.find({ lugar });
    res.json(climas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el clima.");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
