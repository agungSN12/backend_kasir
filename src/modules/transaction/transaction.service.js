const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const supabase = require("../../store/supabase");
class TransactionService {
  async getAll({
    page = 1,
    limit = 10,
    search = "",
    payment_status = "",
    sortBy = "created_at",
    order = "asc",
  }) {
    const offset = (page - 1) * limit;

    let query = supabase.from("transaction").select("*", { count: "exact" });

    if (search.trim() !== "") {
      query = query.or(
        `invoice_number.ilike.%${search}%,customer_name.ilike.%${search}%`
      );
    }

    if (payment_status.trim() !== "") {
      query = query.eq("payment_status", payment_status);
    }
    query = query.range(offset, offset + limit - 1);
    query = query.order(sortBy, { ascending: order === "asc" });
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
      .from("transaction")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new NotFoundError("transaksi tidak di temukan");

    return data;
  }
  async generateInvoiceNumber() {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, "0");
    const d = today.getDate().toString().padStart(2, "0");

    const prefix = `INV-${y}${m}${d}`;

    const { data, error } = await supabase
      .from("transaction")
      .select("invoice_number")
      .like("invoice_number", `${prefix}%`);

    if (error) {
      console.error(error);
      throw new BadRequestError("Gagal membuat invoice number");
    }

    let nextNumber = 1;

    if (data.length > 0) {
      const lastInvoice = data[data.length - 1].invoice_number;

      const lastSeq = parseInt(lastInvoice.split("-")[2]);
      nextNumber = lastSeq + 1;
    }

    const seq = nextNumber.toString().padStart(4, "0");

    return `${prefix}-${seq}`;
  }

  async create(payload) {
    const invoiceNumber = await this.generateInvoiceNumber();
    const { data, error } = await supabase
      .from("transaction")
      .insert({ ...payload, invoice_number: invoiceNumber })
      .select();
    if (error) throw error;
    return data[0];
  }
  async update(payload, id) {
    const { error: existingIdError } = await supabase
      .from("transaction")
      .select("*")
      .eq("id", id)
      .single();

    if (existingIdError) throw new NotFoundError("transaksi tidak di temukan");

    const { data, error } = await supabase
      .from("transaction")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async delete(id) {
    const { error } = await supabase
      .from("transaction")
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

  async getMounlySummary() {
    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("transaction")
      .select("*")
      .gte("created_at", startMount.toISOString())
      .lte("created_at", endMount.toISOString());

    if (error) throw error;

    return {
      month: `${now.getFullYear()}-${now.getMonth() + 1}`,
      totalTransaction: data.length,
      data: data,
    };
  }

  async getMounlyChart() {
    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("transaction")
      .select("*")
      .gte("created_at", startMount.toISOString())
      .lte("created_at", endMount.toISOString());

    if (error) throw error;

    const daysInMount = endMount.getDate();
    const chartData = [];

    for (let day = 1; day <= daysInMount; day++) {
      chartData.push({
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`,
        income: 0,
      });
    }

    for (const tx of data) {
      const date = new Date(tx.created_at);
      const day = date.getDate();
      const amount = parseInt(tx.total_amount);

      if (chartData[day - 1]) {
        chartData[day - 1].income += amount;
      }
    }

    return chartData;
  }

  async getTodayTransaction() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endofDay = new Date();
    endofDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("transaction")
      .select("*")
      .gte("created_at", today.toISOString())
      .lte("created_at", endofDay.toISOString());

    if (error) throw error;

    return data;
  }
}

module.exports = new TransactionService();
