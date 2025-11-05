import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("trip_packs");
  if (exists) return;
  return knex.schema.createTable("trip_packs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("trip_id")
      .notNullable()
      .references("id")
      .inTable("trips")
      .onDelete("CASCADE");
    table.string("pack_version").notNullable().defaultTo("1.0.0");
    table.string("map_image_url").nullable(); // S3 or static file path
    table.json("tips").nullable(); // Array of tips/notes
    table.integer("pack_size_bytes").nullable();
    table.string("checksum").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.index("trip_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("trip_packs");
}
