import { Router } from "express";
import { templateCtrl } from "./dependencies";
import { validateFields } from "../../../middlewares";
import { body, param } from "express-validator";

const router = Router()

router.post('/', [
    //* data: string html
    body('data', 'is required').notEmpty(),
    body('data', 'must be string').isString(),
    validateFields
], templateCtrl.save)

router.get('/:id', [
    param('id', 'is required').notEmpty(),
    validateFields
], templateCtrl.findeOne)

router.get('/', templateCtrl.getAll)

export default router