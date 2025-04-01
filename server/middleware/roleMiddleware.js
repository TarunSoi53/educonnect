export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const userRole = req.user.role;
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    message: 'Access denied. Insufficient permissions.' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}; 