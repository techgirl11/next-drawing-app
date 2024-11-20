import firebaseApp from "../../firebaseConfig";
import { addDoc, collection, getFirestore } from "firebase/firestore";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, drawingName, drawingData } = req.body;
    const drawingId = await saveUserDrawing(userId, drawingName, drawingData);

    if (drawingId) {
      res.status(200).json({ message: "Drawing saved successfully" });
    } else {
      res.status(500).json({ message: "Error saving drawing" });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
}

async function saveUserDrawing(userId, drawingName, drawingData) {
  const db = getFirestore(firebaseApp);
  const docRef = await addDoc(collection(db, "drawings"), {
    userId: userId,
    name: drawingName,
    drawing: drawingData,
  });

  return docRef.id;
}
