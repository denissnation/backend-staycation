const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.get('/logout', adminController.actionLogout);
router.use(auth);
router.get('/dashboard', adminController.viewDashboard);
// Category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
// Bank
router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);
// Item
router.get('/item', adminController.viewItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.delete('/item/:id/delete', adminController.deleteItem);

router.get('/item/show_detail_item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', upload, adminController.addFeature);
router.put('/item/edit/feature', upload, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

router.post('/item/add/activity', upload, adminController.addActivity);
router.put('/item/edit/activity', upload, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);

router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);

module.exports = router;
