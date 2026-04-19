import express from "express";
import authenticateToken from "../middlewares/authToken.js";
import { globalSearch } from "../controllers/Search/GlobalSearch.js";
const router = express.Router();
router.get("/", authenticateToken, globalSearch);
export default router;
