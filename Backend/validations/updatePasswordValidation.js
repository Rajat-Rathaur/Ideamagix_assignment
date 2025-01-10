const updatePasswordValidation = async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;

        if (password == null || newPassword == null) {
            res.status(400).json({ error: "The request body doesn't contain all the fields that are required to update the user's password.", success: false });
        }
        else if (newPassword.length < 8) {
            res.status(400).json({ error: "New password must be at least 8 characters long", success: false });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error occurred while validating fields while updating the user's password.", success: false });
    }
};

export default  updatePasswordValidation ;
