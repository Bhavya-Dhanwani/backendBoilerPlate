// function to sanitize the user data
function sanitizeUser(user: any) {

    // if user is null or undefined, return null
    if (!user) {
        return null;
    }

    // return sanitized user object
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
    };

}

export default sanitizeUser;
