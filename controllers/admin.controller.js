import adminModel from "../models/admin.model.js";
import validateAdmin from "../validator/admin.validator.js";

export const adminRegister = async (req, res) => {
  try {
    const admin = await adminModel.find()
    if (admin.length !== 0) return res.send("admin already exist.")
    const {
      fullname,
      username,
      email,
      password,
      phone,
      gender,
      profilepicture,
    } = req.body;
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const hasshedpassword = await adminModel.passwordhashkaro(password)
    const createAdmin = await adminModel.create({
      fullname,
      username,
      email,
      password: hasshedpassword,
      phone,
      gender,
      profilepicture,
    });
    res.status(201).send(createAdmin);
  } catch (error) {
    res.status(500).send(error.errorResponse);
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("username or password required.")
    const admin = await adminModel.findOne({ username: username }).select('+password')
    if (!admin) return res.status(404).send("username or password not valid.")
    const ismatch = await admin.passwordcomparekaro(password)
    if (!ismatch) return res.status(404).send("p n c.")
    const token = admin.generateToken()
    res.cookie("token", token, {
      httpOnly: true,      // JS se access na ho
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "none",  // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 1 din
    });
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
export const adminDashboard = (req, res) => {
  try {
    const { admin } = req;
    if (!admin) return res.status(401).send("Not LoggedIn / Unauthorized")
    res.send(admin)
  } catch (error) {
    res.send(error)
  }
}
export const adminLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
