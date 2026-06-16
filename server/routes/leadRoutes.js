const express = require('express');
const router = express.Router();
const { protect, managerOrAdmin } = require('../middleware/authMiddleware');
const {
  createLead, getLeads, getLeadById, updateLead, deleteLead
} = require('../controllers/leadController');

router.use(protect);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', managerOrAdmin, createLead);
router.put('/:id', managerOrAdmin, updateLead);
router.delete('/:id', managerOrAdmin, deleteLead);

module.exports = router;