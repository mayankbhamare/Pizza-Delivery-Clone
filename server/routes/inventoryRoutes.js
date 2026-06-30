const express = require('express');
const router = express.Router();
const {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getInventory)
    .post(protect, admin, addInventoryItem);

router
    .route('/:id')
    .put(protect, admin, updateInventoryItem)
    .delete(protect, admin, deleteInventoryItem);

module.exports = router;
