import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("alert_retry_log");
  if (exists) return;
  return knex.schema.createTable("alert_retry_log", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("alert_id")
      .notNullable()
      .references("id")
      .inTable("alerts")
      .onDelete("CASCADE");
    table.integer("retry_attempt").notNullable();
    table.string("status").notNullable(); // success, failed
    table.text("error_message").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index("alert_id");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("alert_retry_log");
}
