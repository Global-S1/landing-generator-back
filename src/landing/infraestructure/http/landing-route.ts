import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { validateFields, validateFile } from '../../../middlewares'
import { landingCtrl } from './dependencies'

const router = Router()

router.get('/:id', [
    param('id', 'is required').notEmpty(),
    validateFields
], landingCtrl.findOne)

router.post('/create', [
    body('prompt', 'prompt is required').notEmpty(),
    body('prompt', 'must be of type string').isString(),
    body('user_id', 'must be of type string').isString(),
    body('template_id', 'must be of type string').isString(),
    validateFields
], landingCtrl.create)

router.put('/edit-section/:id', [
    param('id', 'is required').notEmpty(),
    body('prompt', 'prompt is required').notEmpty(),
    body('prompt', 'must be of type string').isString(),
    body('section', 'must be of type string').isString(),
    validateFields
], landingCtrl.editSectionWithAi)

router.put('/edit-template/:id', [
    param('id', 'is required').notEmpty(),
    body('template', 'template is required is required').notEmpty(),
    body('template', 'must be of type string').isString(),
    validateFields
], landingCtrl.editTemplate)

router.put('/edit-element/:id', [
    param('id', 'is required').notEmpty(),
    body('sectionId', 'must be required').isString(),
    body('tagName', 'must be required').isString(),
    validateFields
], landingCtrl.editElementContent)


router.get('/earlier-version/:id', [
    param('id', 'is required').notEmpty(),
    validateFields
], landingCtrl.earlierVersion)

router.post('/export/:id', [
    param('id', 'is required').notEmpty(),
    body('template', 'template is required').notEmpty(),
    validateFields
], landingCtrl.exportLanding)

router.post('/images/create/:id', [
    param('id', 'is required').notEmpty(),
    body('prompt', 'prompt is required').notEmpty(),
    body('oldSrc', 'oldSrc is required').notEmpty(),
    body('sectionId', 'must be required').isString(),
    validateFields
], landingCtrl.createImgAi)

router.post('/images/upload/:id', [
    param('id', 'is required').notEmpty(),
    query('oldSrc', 'must be required').isString(),
    query('sectionId', 'must be required').isString(),
    validateFile(['png', 'jpg', 'jpeg']),
    validateFields
], landingCtrl.uploadImg)

export default router