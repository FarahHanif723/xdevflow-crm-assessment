const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      timeline: [{
        action: 'Lead Created',
        performedBy: req.user.id,
        changes: `Lead "${req.body.fullName}" created with status "${req.body.status || 'New'}"`
      }]
    });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { search, status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (search) filter.fullName = { $regex: search, $options: 'i' };
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return res.status(404).json({ message: 'Lead not found' });

    const changes = [];
    if (req.body.fullName && req.body.fullName !== oldLead.fullName)
      changes.push(`Name: "${oldLead.fullName}" → "${req.body.fullName}"`);
    if (req.body.email && req.body.email !== oldLead.email)
      changes.push(`Email: "${oldLead.email}" → "${req.body.email}"`);
    if (req.body.phone && req.body.phone !== oldLead.phone)
      changes.push(`Phone: "${oldLead.phone}" → "${req.body.phone}"`);
    if (req.body.company && req.body.company !== oldLead.company)
      changes.push(`Company: "${oldLead.company}" → "${req.body.company}"`);
    if (req.body.status && req.body.status !== oldLead.status)
      changes.push(`Status: "${oldLead.status}" → "${req.body.status}"`);

    const timelineEntry = {
      action: req.body.status && req.body.status !== oldLead.status
        ? `Status Changed to "${req.body.status}"`
        : 'Lead Updated',
      performedBy: req.user.id,
      changes: changes.length > 0 ? changes.join(', ') : 'No changes'
    };

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $push: { timeline: timelineEntry }
      },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};