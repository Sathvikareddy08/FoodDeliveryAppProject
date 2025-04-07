const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.food');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const food = await Food.findById(foodId);
    
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    let cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.food.toString() === foodId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.food');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/:userId/update/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity = quantity;
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.food');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.food');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 