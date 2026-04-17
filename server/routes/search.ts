import express from "express";
import authenticateToken from "../middlewares/authToken";
import { globalSearch } from "../controllers/Search/GlobalSearch";

const router = express.Router();

router.get("/", authenticateToken, globalSearch);

export default router;
