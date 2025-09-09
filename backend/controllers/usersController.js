const db = require("../db/queries")

const getUserProfile = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const profile = await db.getProfileByUserId(userId);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" })
        }
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" })
    }
}

module.exports = {
    getUserProfile
}