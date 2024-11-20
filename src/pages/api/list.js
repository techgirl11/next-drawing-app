import firebaseApp from "../../firebaseConfig";
import { getDocs, collection, query, where, getFirestore } from "firebase/firestore";
/**
 * Handles a GET request to the /api/list endpoint.
 *
 * Given a userId, it fetches the user's drawings from the Firestore database
 * and returns them as a JSON response.
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;
    const drawings = await getUserDrawings(userId);

    if (drawings) {
      res.status(200).json(drawings);
    } else {
      res.status(500).json({ message: "Error fetching your drawings" });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
}

/**
 * Given a userId, it fetches the user's drawings from the Firestore database
 * and returns them as a JSON object array.
 *
 * @param {string} userId
 * @returns {Promise<array<object>>}
 */
async function getUserDrawings(userId) {
  const db = getFirestore(firebaseApp);
  const getUserDrawingsQuery = query(
    collection(db, "drawings"),
    where("userId", "==", userId)
  );
  const querySnapShot = await getDocs(getUserDrawingsQuery);
  const data = querySnapShot.docs.map((doc) => ({
    drawingId: doc.id,
    userId: doc.data().userId,
    name: doc.data().name,
    drawing: doc.data().drawing,
  }));

  return data;
}
