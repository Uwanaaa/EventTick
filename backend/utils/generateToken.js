import jwt from "jsonwebtoken";


export const generateToken = (id) => {
  if (process.env.SECRET !== undefined) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30d' });
  }
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (err) {
    if (err.name === "JSONWebTokenError") {
      throw new Error("Invalid token");
    } else if (err.name === "TokenExpiredError") {
      throw new Error("Token Expired");
    } else {
      throw new Error("Failed to verify token");
    }
  }
}



//Generate 6 digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
