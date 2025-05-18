
const excludedRoutes = [
    "/auth/logout",
    "/api/v1/admin/block-user",
    "/api/v1/admin/unblock-user",
    "/api/v1/users/profile-pictures",
    
]

export const RequestBodyValidator = (req, res, next) => {

    if (req.method !== "POST" && req.method !== "PUT") {
        return next();
    }
    if (excludedRoutes.includes(req.path) || req.path.startsWith("/api/v1/admin/block-user") || req.path.startsWith("/api/v1/admin/unblock-user")) {
        return next();
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body cannot be empty" })
    } else {
        next();
    }
}