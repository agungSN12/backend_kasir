const NotFoundError = require("../../errors/NotFoundError");
const supabase = require("../../store/supabase");

class ProductService {
  async getAll({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sortBy = "created_at",
    order = "asc",
  }) {
    const offset = (page - 1) * limit;
    let query = supabase.from("product").select("*", { count: "exact" });

    if (search.trim() !== "") {
      query = query.or(
        `name_product.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (status.trim() !== "") {
      query = query.eq("status", status);
    }

    query = query.order(sortBy, { ascending: order === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return {
      data,
      page,
      limit,
      totalData: count,
      totalPage: Math.ceil(count / limit),
    };
  }
  async getById(id) {
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw data;
    if (!data) {
      throw new NotFoundError("id produk tidak di temukan");
    }

    return data;
  }
  async uploadImage(file, filename) {
    const { data, error } = await supabase.storage
      .from("product_images")
      .upload(`images/${filename}`, file, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw error;

    return data.path;
  }

  getPublicUrl(path) {
    const { data } = supabase.storage.from("product_images").getPublicUrl(path);

    return data.publicUrl;
  }

  async create(payload, file, filename) {
    const imgPath = await this.uploadImage(file, filename);

    const imgUrl = this.getPublicUrl(imgPath);

    const { data, error } = await supabase
      .from("product")
      .insert([{ ...payload, image: imgUrl }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  async update(payload, id, file, filename) {
    const { data: existingId, error: errorExistingId } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .single();

    if (errorExistingId) throw new NotFoundError("id tidak di temukan");

    let imgURL = null;

    if (file) {
      if (existingId) {
        const imageOldProduct = existingId.image.split("/product_images/")[1];

        await supabase.storage.from("product_images").remove([imageOldProduct]);
      }
      const imgPath = await this.uploadImage(file, filename);
      imgURL = this.getPublicUrl(imgPath);
    }

    const updateProduct = { ...payload };

    if (imgURL) {
      updateProduct.image = imgURL;
    }

    const { data, error } = await supabase
      .from("product")
      .update(updateProduct)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from("product")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("id tidak ditemukan");
      }
      throw error;
    }

    return true;
  }
}

module.exports = new ProductService();
