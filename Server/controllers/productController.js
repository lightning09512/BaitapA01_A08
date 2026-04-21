const { Product, Review, Sequelize, sequelize } = require('../models');

const getProducts = async (req, res) => {
    try {
        const { search, category, brand, page, limit } = req.query;
        const normalizedSearch = typeof search === 'string'
            ? search.trim().replace(/\s+/g, ' ')
            : '';
        const conditions = [];
        const replacements = {};

        if (normalizedSearch) {
            const terms = normalizedSearch.toLowerCase().split(' ').filter(Boolean);
            terms.forEach((term, index) => {
                const key = `term${index}`;
                replacements[key] = `%${term}%`;
                conditions.push(`(
                    LOWER(name) LIKE :${key}
                    OR LOWER(brand) LIKE :${key}
                    OR LOWER(category) LIKE :${key}
                    OR LOWER(description) LIKE :${key}
                )`);
            });
        }

        if (category && category !== 'All') {
            replacements.category = category;
            conditions.push('category = :category');
        }

        if (brand && brand !== 'All') {
            replacements.brand = brand;
            conditions.push('brand = :brand');
        }

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        if (!page && !limit) {
            const products = await sequelize.query(
                `SELECT * FROM Products ${whereSql} ORDER BY id DESC`,
                { replacements, type: Sequelize.QueryTypes.SELECT }
            );
            return res.json(products);
        }

        const pg = parseInt(page, 10) || 1;
        const lim = parseInt(limit, 10) || 10;
        const offset = (pg - 1) * lim;
        replacements.limit = lim;
        replacements.offset = offset;

        const [items, countRows] = await Promise.all([
            sequelize.query(
                `SELECT * FROM Products ${whereSql} ORDER BY id DESC LIMIT :limit OFFSET :offset`,
                { replacements, type: Sequelize.QueryTypes.SELECT }
            ),
            sequelize.query(
                `SELECT COUNT(*) AS total FROM Products ${whereSql}`,
                { replacements, type: Sequelize.QueryTypes.SELECT }
            )
        ]);

        const total = Number(countRows?.[0]?.total || 0);
        res.json({
            items,
            page: pg,
            limit: lim,
            total,
            hasMore: offset + lim < total
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
            attributes: ['category'],
            group: ['category'],
            raw: true
        });
        const categoryList = cats.map(c => c.category).filter(c => c);
        res.json(categoryList);
    } catch (error) {
        console.error('getCategories error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getBrands = async (req, res) => {
    try {
        const brands = await Product.findAll({
            attributes: ['brand'],
            group: ['brand'],
            raw: true
        });
        const brandList = brands.map(b => b.brand).filter(b => b);
        res.json(brandList);
    } catch (e) {
        console.error('getBrands error:', e);
        res.status(500).json({ error: e.message });
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
            const { User, UserViewedHistory } = require('../models');
            const user = await User.findOne({ where: { username: req.user.username } });
            if (user) {
                // Sequence tracking: Remove old record and create fresh one to get a new highest ID
                await UserViewedHistory.destroy({ where: { UserId: user.id, ProductId: product.id } });
                await UserViewedHistory.create({ UserId: user.id, ProductId: product.id });
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
    getBrands,
    viewProduct,
    getSimilar
};
