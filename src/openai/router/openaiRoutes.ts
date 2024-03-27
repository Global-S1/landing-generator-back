import { Router } from 'express'
import {
    chatCtrl,
    chatWithFineTunedModelCtrl,
    describeImgCtrl,
    fineTuneCtrl,
    generateCodeFromImgCtrl,
    generateTemplateFromImgCtrl,
    trainingDataCtrl,
    tuningJobsListCtrl,
    uploadFileCtrl,
} from '../controllers'
import { body, query } from 'express-validator'
import { validateFields, validateFile } from '../../middlewares'
import { createImgCtrl, serverImage } from '../controllers/dalle/create-img'

const router = Router()

router.post('/chat', [
    body('prompt', 'El prompt es requerido').isString(),
    validateFields
], chatCtrl)

router.post('/file', uploadFileCtrl)

router.post('/fine-tune', fineTuneCtrl)

router.get('/tuning-list', tuningJobsListCtrl)

router.post('/fine-tuned-model', [
    body('prompt', 'El prompt es requerido').isObject(),
    validateFields
], chatWithFineTunedModelCtrl)

router.post('/vision', [
    validateFile(['png', 'jpg', 'jpeg']),
    validateFields
], generateTemplateFromImgCtrl)

router.post('/desc-img', [
    validateFile(['png', 'jpg', 'jpeg']),
    validateFields
], describeImgCtrl)

router.post('/img-to-code', [
    validateFile(['png', 'jpg', 'jpeg']),
    validateFields
], generateCodeFromImgCtrl)


router.post('/setdata/ft', [
    query('fileId', 'Es requirido').notEmpty(),
    query('frameId', 'Es requerido y sigue la siguiente estructura 1-3').notEmpty(),
    validateFile(['json']),
    validateFields
], trainingDataCtrl)


router.post('/img', createImgCtrl)
router.get('/imagen/:fileName', serverImage )

export default router