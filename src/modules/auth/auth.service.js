const supabase = require("../../store/supabase");
const bcrypt = require("bcrypt");
const jwt = require("../../middlewares/JwtService.middleware");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");

class AuthService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

  async register({ name, email, password, role, address, phone, avatar }) {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) throw error;

    if (existingUser.length > 0) {
      throw new BadRequestError("email sudah terdaftar");
    }

    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    const { data, error: dataError } = await supabase
      .from("users")
      .insert({ name, email, password: hash, role, address, phone, avatar })
      .select();

    if (dataError) throw dataError;

    const NewUser = data[0];

    const token = jwt.sign({ id: NewUser.id, email: NewUser.email });

    return { user: NewUser, token };
  }

  async login({ email, password }) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      throw new NotFoundError("email tidak terdaftar");
    }
    if (error) {
      throw error;
    }
    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) throw new BadRequestError("Passwordnya salah boy");

    const token = jwt.sign({ id: data.id, email: data.email, role: data.role });

    delete data.password;
    return { user: data, token };
  }

  async Profile(userId) {
    const { data: dataUserById, error: errorFetch } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (errorFetch) {
      throw new BadRequestError(`gagal mengambil data`);
    }
    return dataUserById;
  }
}

module.exports = new AuthService();
