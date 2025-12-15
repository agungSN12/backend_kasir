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
    order = "desc",
  }) {
    const offset = (page - 1) * limit;

    let query = supabase.from("transaction").select(
      `
        id,
        invoice_number,
        customer_name,
        total_amount,
        payment_status,
        created_at
      `,
      { count: "exact" }
    );

    // 🔍 search
    if (search.trim() !== "") {
      query = query.or(
        `invoice_number.ilike.%${search}%,customer_name.ilike.%${search}%`
      );
    }

    // 💳 filter status
    if (payment_status.trim() !== "") {
      query = query.eq("payment_status", payment_status);
    }

    // ↕ sorting + pagination
    query = query
      .order(sortBy, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    const totalIncome = data.reduce((sum, item) => sum + item.total_amount, 0);

    return {
      data,
      page,
      limit,
      totalIncome,
      totalData: count,
      totalPage: Math.ceil(count / limit),
    };
  }

  async getById(id) {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        `
      id,
      invoice_number,
      customer_name,
      payment_method,
      total_amount,
      payment_status,
      note,
      created_at,
      detail_transaction (
        id,
        product_id,
        price,
        qty,
        subtotal
      )
    `
      )
      .eq("id", id)
      .maybeSingle(); // ✅ LEBIH AMAN

    if (error) throw error;
    if (!data) throw new NotFoundError("Transaksi tidak ditemukan");

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

    const { items, ...transactionPayload } = payload;

    // 1. insert transaction
    const { data: transaction, error } = await supabase
      .from("transaction")
      .insert({
        ...transactionPayload,
        invoice_number: invoiceNumber,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. insert transaction items
    const transactionItems = items.map((item) => ({
      transaction_id: transaction.id,
      product_id: item.product_id,
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
    }));

    const { error: itemError } = await supabase
      .from("detail_transaction")
      .insert(transactionItems);

    if (itemError) throw itemError;

    return transaction;
  }

  async update(payload, id) {
    // 1. cek transaksi ada
    const { error: existingError } = await supabase
      .from("transaction")
      .select("id")
      .eq("id", id)
      .single();

    if (existingError) {
      throw new NotFoundError("Transaksi tidak ditemukan");
    }

    // 2. pisahkan items
    const { items, ...transactionPayload } = payload;

    // 3. update transaction
    const { data: transaction, error } = await supabase
      .from("transaction")
      .update(transactionPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // 4. jika items ada dan array, hapus dan insert ulang
    if (Array.isArray(items) && items.length > 0) {
      // hapus item lama
      const { error: deleteError } = await supabase
        .from("detail_transaction")
        .delete()
        .eq("transaction_id", id);

      if (deleteError) throw deleteError;

      // insert item baru
      const transactionItems = items.map((item) => ({
        transaction_id: id,
        product_id: item.product_id,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
      }));

      const { error: itemError } = await supabase
        .from("detail_transaction")
        .insert(transactionItems);

      if (itemError) throw itemError;
    }

    return transaction;
  }

  async delete(id) {
    const { error } = await supabase.from("transaction").delete().eq("id", id);

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("Transaksi tidak ditemukan");
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
    const totalIncome = data.reduce((sum, item) => sum + item.total_amount, 0);

    return {
      data: data,
      month: `${now.getFullYear()}-${now.getMonth() + 1}`,
      totalTransaction: data.length,
      totalIncome: totalIncome,
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

  async getWeeklySummary() {
    const now = new Date();

    // Cari hari Senin minggu ini
    const day = now.getDay(); // Minggu=0, Senin=1
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const startWeek = new Date(now);
    startWeek.setDate(now.getDate() + diffToMonday);
    startWeek.setHours(0, 0, 0, 0);

    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 6);
    endWeek.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("transaction")
      .select("*")
      .gte("created_at", startWeek.toISOString())
      .lte("created_at", endWeek.toISOString());

    if (error) throw error;

    const totalIncome = data.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0
    );

    return {
      startWeek: startWeek.toISOString().split("T")[0],
      endWeek: endWeek.toISOString().split("T")[0],
      totalTransaction: data.length,
      totalIncome,
      data,
    };
  }

  async getBestSellingByQty(limit = 5) {
    const { data, error } = await supabase.rpc("get_best_selling", {
      limit_count: limit,
    });

    if (error) throw error;

    return data;
  }
}

module.exports = new TransactionService();
