// server/src/routes/rules.js
const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');

// Helper function to parse rule string into AST
function createAst(ruleString) {
  let tokens = tokenize(ruleString);
  let position = 0;

  function parseExpression() {
    if (tokens[position] === '(') {
      position++;
      const left = parseExpression();
      const operator = tokens[position++];
      const right = parseExpression();
      position++; // Skip closing parenthesis
      return {
        type: 'operator',
        operator: operator,
        left: left,
        right: right
      };
    } else {
      const field = tokens[position++];
      const operator = tokens[position++];
      const value = tokens[position++];
      return {
        type: 'operand',
        field: field,
        operator: operator,
        value: isNaN(value) ? value.replace(/'/g, '') : Number(value)
      };
    }
  }

  return parseExpression();
}

function tokenize(ruleString) {
  return ruleString
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(' ')
    .filter(token => token.length > 0);
}

// Create a new rule
router.post('/', async (req, res) => {
  try {
    const { name, description, ruleString } = req.body;
    const ast = createAst(ruleString);
    
    const rule = new Rule({
      name,
      description,
      ast,
      originalString: ruleString
    });

    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all rules
router.get('/', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Evaluate rule
router.post('/evaluate', async (req, res) => {
  try {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId);

    function evaluateNode(node) {
      if (node.type === 'operand') {
        const actualValue = data[node.field];
        switch (node.operator) {
          case '>': return actualValue > node.value;
          case '<': return actualValue < node.value;
          case '=': return actualValue === node.value;
          case '>=': return actualValue >= node.value;
          case '<=': return actualValue <= node.value;
          default: throw new Error(`Unknown operator: ${node.operator}`);
        }
      } else {
        const leftResult = evaluateNode(node.left);
        const rightResult = evaluateNode(node.right);
        return node.operator === 'AND' ? leftResult && rightResult : leftResult || rightResult;
      }
    }

    const result = evaluateNode(rule.ast);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;