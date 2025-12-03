import { Client, Databases, Users } from "node-appwrite";

export default async ({ req, res, log }) => {
  try {
    const payload = req.body ? JSON.parse(req.body) : {};
    const { userId, documentId } = payload;

    if (!userId || !documentId) {
      return res.json({
        success: false,
        message: "userId and documentId are required",
      });
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);
    const databases = new Databases(client);

    await users.delete(userId);

    return res.json({
      success: true,
      message: `Employee deleted successfully.`,
    });

  } catch (error) {
    log(error);
    return res.json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};
