import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("alerts");
  if (exists) return;
  return knex.schema.createTable("alerts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("type").notNullable(); // SOS, LOW_BATTERY, MANUAL
    table.json("payload").notNullable(); // {lat, lng, message, timestamp, etc}
    table.string("status").notNullable().defaultTo("pending"); // pending, sent, failed
    table.string("delivery_method").nullable(); // sms, api, twilio
    table.text("error_message").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("sent_at").nullable();
    table.index("user_id");
    table.index("status");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("alerts");
}
