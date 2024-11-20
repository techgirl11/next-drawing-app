import firebaseApp from "../../firebaseConfig";
import { addDoc, collection, getFirestore } from "firebase/firestore";
/**
 * Handles a POST request to the /api/save endpoint.
 *
 * Saves a new drawing to the Firestore database
 * Returns a JSON response with a 200/500 status code 
 * respectively if the drawing is saved successfully, or an error is encountered
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */

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

/**
 * Saves a new drawing to the Firestore database.
 * Returns the ID of the newly created document, or null if an error is encountered
 *
 * @param {string} userId
 * @param {string} drawingName
 * @param {object} drawingData
 * @returns {string|null}
 */
async function saveUserDrawing(userId, drawingName, drawingData) {
  const db = getFirestore(firebaseApp);
  const docRef = await addDoc(collection(db, "drawings"), {
    userId: userId,
    name: drawingName,
    drawing: drawingData,
  });

  return docRef.id;
}
