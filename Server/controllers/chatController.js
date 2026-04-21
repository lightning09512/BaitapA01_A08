const { ChatMessage, User, Sequelize, Op } = require('../models');

// User fetches their chat with admin
// Admin fetches their chat with a specific user
const getChatHistory = async (req, res) => {
    try {
        const { targetId } = req.params;
        const currentUserId = req.user.id;

        const messages = await ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: targetId },
                    { senderId: targetId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        // Mark messages as read if the recipient is current user
        await ChatMessage.update(
            { isRead: true },
            { where: { receiverId: currentUserId, senderId: targetId, isRead: false } }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin list of active conversations
const getAdminConversations = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Find all unique users who sent/received messages to/from admin
        const conversations = await ChatMessage.findAll({
            where: {
                [Op.or]: [{ senderId: adminId }, { receiverId: adminId }]
            },
            attributes: [
                [Sequelize.fn('MAX', Sequelize.col('id')), 'lastId'],
                [Sequelize.literal("CASE WHEN senderId = " + adminId + " THEN receiverId ELSE senderId END"), 'partnerId']
            ],
            group: ['partnerId'],
            raw: true
        });

        const results = [];
        for (const conv of conversations) {
            const partner = await User.findByPk(conv.partnerId, {
                attributes: ['id', 'username', 'name', 'avatar']
            });
            const lastMsg = await ChatMessage.findByPk(conv.lastId);
            
            if (partner) {
                results.push({
                    partner,
                    lastMessage: lastMsg.content,
                    lastTime: lastMsg.createdAt,
                    unreadCount: await ChatMessage.count({
                        where: { senderId: conv.partnerId, receiverId: adminId, isRead: false }
                    })
                });
            }
        }

        // Sort by latest message
        results.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessageInternal = async (senderId, receiverId, content) => {
    return await ChatMessage.create({
        senderId,
        receiverId,
        content,
        isRead: false
    });
};

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;

        if (!receiverId || !content || !content.trim()) {
            return res.status(400).json({ message: 'Thiếu người nhận hoặc nội dung tin nhắn.' });
        }

        const message = await sendMessageInternal(senderId, Number(receiverId), content.trim());
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory,
    getAdminConversations,
    sendMessageInternal,
    sendMessage
};
