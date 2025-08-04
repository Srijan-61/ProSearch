import User from '../models/user.model.js';

//  GET USER LIST (Authenticated)
export async function getUserList(req, res) {
    try {
        const users = await User.find().select('-password'); // Exclude passwords

        res.status(200).json({
            message: 'User list fetched successfully',
            users: users
        });
    } catch (err) {
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
}

// SEARCH USERS BY USERNAME
export async function searchUsers(req, res) {
    try {
        const { u } = req.query;
        if (!u) {
            return res.status(400).json({ message: 'Query parameter u is required' });
        }
        // Search by username
        const users = await User.find({
            username: { $regex: u, $options: 'i' }
        }).select('-password'); // Exclude passwords

        res.status(200).json({message: 'User search successful',users: users});
    } catch (err) {
        res.status(500).json({message: 'Server error',error: err.message});
    }
}
