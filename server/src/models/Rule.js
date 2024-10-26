// server/src/models/Rule.js
const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['operator', 'operand'],
    required: true
  },
  operator: {
    type: String,
    enum: ['AND', 'OR', '>', '<', '>=', '<=', '='],
    required: function() { return this.type === 'operator'; }
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: function() { return this.type === 'operand'; }
  },
  field: {
    type: String,
    required: function() { return this.type === 'operand'; }
  },
  left: {
    type: mongoose.Schema.Types.Mixed,
    required: function() { return this.type === 'operator'; }
  },
  right: {
    type: mongoose.Schema.Types.Mixed,
    required: function() { return this.type === 'operator'; }
  }
});

const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  ast: {
    type: NodeSchema,
    required: true
  },
  originalString: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rule', RuleSchema);