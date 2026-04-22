const { CartItem, Product, User, ProductVariant } = require('../models');

const getCart = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username }, include: ['CartItems'] });
        if (!user) return res.status(404).json({ message: "Lỗi user" });

        const items = [];
        let totalAmount = 0;
        let totalQuantity = 0;

        for (const item of user.CartItems || []) {
            const product = await Product.findByPk(item.productId);
            let variant = null;
            if (item.variantId) {
                variant = await ProductVariant.findByPk(item.variantId);
            }

            if (product) {
                const price = variant ? variant.price : product.price;
                const lineTotal = price * item.quantity;
                totalAmount += lineTotal;
                totalQuantity += item.quantity;
                
                let variantName = '';
                if (variant) {
                    const parts = [];
                    if (variant.ram) parts.push(variant.ram);
                    if (variant.rom) parts.push(variant.rom);
                    if (variant.color) parts.push(variant.color);
                    variantName = parts.join(' / ');
                }

                items.push({
                    id: item.id,
                    productId: product.id,
                    variantId: item.variantId,
                    name: product.name,
                    image: product.image,
                    price: price,
                    quantity: item.quantity,
                    lineTotal,
                    variantName
                });
            }
        }

        res.json({ items, totalAmount, totalQuantity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, variantId } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        const product = await Product.findByPk(Number(productId));

        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const qty = Number(quantity) > 0 ? Number(quantity) : 1;
        const vId = variantId ? Number(variantId) : null;

        let cartItem = await CartItem.findOne({ 
            where: { userId: user.id, productId: product.id, variantId: vId } 
        });

        if (cartItem) {
            cartItem.quantity += qty;
            await cartItem.save();
        } else {
            await CartItem.create({ 
                userId: user.id, 
                productId: product.id, 
                variantId: vId,
                quantity: qty 
            });
        }

        return getCart(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        const vId = variantId ? Number(variantId) : null;
        
        const cartItem = await CartItem.findOne({ 
            where: { userId: user.id, productId: Number(productId), variantId: vId } 
        });
        if (!cartItem) return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

        const qty = Number(quantity) || 0;
        if (qty <= 0) {
            await cartItem.destroy();
        } else {
            cartItem.quantity = qty;
            await cartItem.save();
        }

        return getCart(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId } = req.body;
        const user = await User.findOne({ where: { username: req.user.username } });
        const vId = variantId ? Number(variantId) : null;
        
        await CartItem.destroy({ 
            where: { userId: user.id, productId: Number(productId), variantId: vId } 
        });

        return getCart(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        await CartItem.destroy({ where: { userId: user.id } });

        res.json({ items: [], totalAmount: 0, totalQuantity: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
};
