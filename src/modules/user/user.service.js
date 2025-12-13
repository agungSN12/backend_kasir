const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const supabase = require("../../store/supabase");
const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this.SALT_ROUNDS = 10;
  }

  async getAll() {
    const { data: userData, error: errorUserData } = await supabase
      .from("users")
      .select("created_at,update_at,id,name,email,role,address,phone,avatar");

    if (errorUserData) throw errorUserData;

    return { user: userData };
  }

  async getById(id) {
    const { data: userDataById, error: errorUserDataById } = await supabase
      .from("users")
      .select("created_at,update_at,id,name,email,role,address,phone,avatar")
      .eq("id", id)
      .single();

    if (errorUserDataById) throw new NotFoundError("user tidak di temukan");

    return { user: userDataById };
  }

  async create(data) {
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email);

    if (error) throw error;

    if (existingUser.length > 0) {
      throw new BadRequestError("email sudah di pakai");
    }

    const hash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const { data: createUser, error: errorCreateUser } = await supabase
      .from("users")
      .insert([{ ...data, password: hash }])
      .select("name,email,role,address,phone,avatar");

    if (errorCreateUser) throw errorCreateUser;

    return { userCreate: createUser };
  }

  async update(data, id) {
    const { data: existingUserId, error: errorExistingUserId } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (errorExistingUserId) throw new NotFoundError("id tidak di temukan");

    if (data.email && data.email !== existingUserId.email) {
      const { data: existingEmail, error: errorExistingEmail } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email);
      if (errorExistingEmail) throw errorExistingEmail;
      if (existingEmail.length > 0)
        throw new BadRequestError("email sudah digunakan boy");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    } else {
      delete data.password;
    }

    const { data: updateUser, error: errorUpdateUser } = await supabase
      .from("users")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (errorUpdateUser) throw BadRequestError("error saat update");

    return updateUser;
  }

  async delete(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError("id tidak di temukan");

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;
    return true;
  }
}
module.exports = new UserService();
