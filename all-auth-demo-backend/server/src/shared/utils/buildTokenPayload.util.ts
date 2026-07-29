async function buildTokenPayload(user: any) {
    const tokenPayload = {
        _id: user._id,
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
    };
    return tokenPayload;
}

export default buildTokenPayload;
