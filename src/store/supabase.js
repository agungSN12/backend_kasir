const { createClient } = require("@supabase/supabase-js");
const config = require("../config/config");

const supabase = createClient(config.db.supabaseUrl, config.db.secretKey);
if (supabase) {
  console.log("Connection has been established successfuly.");
} else {
  console.error("Unable to connect to the database:", error);
}

module.exports = supabase;
