import * as express from 'express';

const router = express.Router();
router.get('/robot', (req, res) => {
    console.log(req.db);
    console.log(req.date);
    res.send(req.db);
});

export default router;
