import { Router } from 'express'

import { createBasicLandingCtrl, editSectionCtrl, editTemplateCtrl, existTemplateCtrl, resetCtrl } from '../controllers/landingControllers'
import { validateFields } from '../../middlewares'
import { body } from 'express-validator'
import { exportLandingPageCtrl } from '../controllers/exportLanding'
import { editElementContent, getSectionsElementsCtrl, updateSectionElementsCtrl } from '../controllers/getSectionsElements'
import { historyLandigCtrl } from '../controllers/historyLandig'
import { createImgCtrl, serverImage } from '../controllers/imagesController'

const router = Router()

router.get('/exist', existTemplateCtrl)

router.post('/create', [
    body('prompt', 'prompt is required').notEmpty(),
    body('prompt', 'must be of type string').isString(),
    body('template_option', 'must be of type string').isNumeric(),
    validateFields
], createBasicLandingCtrl)

router.put('/edit-section', [
    body('prompt', 'prompt is required').notEmpty(),
    body('prompt', 'must be of type string').isString(),
    body('section', 'must be of type string').isString(),
    validateFields
], editSectionCtrl)

router.put('/edit-template', [
    body('template', 'template is required is required').notEmpty(),
    body('template', 'must be of type string').isString(),
    validateFields
], editTemplateCtrl)

router.post('/export', [
    body('template', 'template is required').notEmpty(),
    validateFields
], exportLandingPageCtrl)

router.delete('/reset', resetCtrl)

router.get('/sections', getSectionsElementsCtrl)

router.put('/sections', updateSectionElementsCtrl)

router.put('/edit-element', [
    body('sectionId', 'must be required').isString(),
    body('tagName', 'must be required').isString(),
    validateFields
], editElementContent)

router.get('/earlier-version', historyLandigCtrl)

router.post('/img-create', [
    body('prompt', 'prompt is required').notEmpty(),
    body('oldSrc', 'oldSrc is required').notEmpty(),
    body('sectionId', 'must be required').isString(),
    validateFields
], createImgCtrl)
router.get('/images/:fileName', serverImage)

export default router