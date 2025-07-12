import express from "express"
import { fetchLocation, fetchHospital } from "../controllers/postControllers.js";
const router = express.Router();

router.get("/location", fetchLocation);

router.post("/hospitals", fetchHospital);

router.get("/", (req, res) => {
    res.status(200).json({msg: "Hello"});
})

export default router;