import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  const token =
    req.cookies.JWTtoken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.role || !decoded.role.includes("ROLE_ADMIN")) {
      return res.status(403).render("layout", {
        title: "Access Denied",
        view: "pages/dashboard",
        error: "Access denied. Admin privileges required.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};
