const { Product, Review, Sequelize } = require('../models');

const getProducts = async (req, res) => {
    try {
        const { search, category, page, limit } = req.query;
        let whereClause = {};

        if (search) {
            whereClause.name = { [Sequelize.Op.like]: `%${search}%` };
        }
        if (category && category !== 'All') {
            whereClause.category = category;
        }

        if (!page && !limit) {
            const products = await Product.findAll({ where: whereClause });
            return res.json(products);
        }

        const pg = parseInt(page, 10) || 1;
        const lim = parseInt(limit, 10) || 10;
        const offset = (pg - 1) * lim;

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit: lim,
            offset: offset,
        });

        res.json({
            items: rows,
            page: pg,
            limit: lim,
            total: count,
            hasMore: offset + lim < count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBestSelling = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const products = await Product.findAll({
            order: [['soldQuantity', 'DESC']],
            limit: limit
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByDiscount = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 20;
        const products = await Product.findAll({
            order: [['discountPercent', 'DESC']],
            limit: limit
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const reviewCount = await Review.count({ where: { productId: product.id } });
        res.json({
            ...product.toJSON(),
            reviewCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const cats = await Product.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
        });
        // extract list strings
        const categoryList = cats.map(c => c.category).filter(c => c);
        res.json(categoryList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        product.viewCount = (product.viewCount || 0) + 1;
        await product.save();

        if (req.user) {
            const { User } = require('../models');
            const user = await User.findOne({ where: { username: req.user.username } });
            if (user) {
                // Remove out old then add newly to simulate unshifted behaviour
                await user.removeViewedProduct(product);
                await user.addViewedProduct(product);
                // To properly respect the top 20 logic without over-complicating relational logic, we just accept relation
            }
        }
        res.json({ success: true, viewCount: product.viewCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSimilar = async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const similar = await Product.findAll({
            where: { category: product.category, id: { [Sequelize.Op.ne]: productId } },
            limit: 10
        });
        res.json(similar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getBestSelling,
    getByDiscount,
    getProductById,
    getCategories,
    viewProduct,
    getSimilar
};
