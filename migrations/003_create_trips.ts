import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("trips");
  if (exists) return;
  return knex.schema.createTable("trips", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table.text("description").nullable();
    table.decimal("start_lat", 10, 8).notNullable();
    table.decimal("start_lng", 11, 8).notNullable();
    table.decimal("end_lat", 10, 8).notNullable();
    table.decimal("end_lng", 11, 8).notNullable();
    table.json("path_coordinates").nullable(); // Array of {lat, lng} for polyline
    table.string("difficulty").nullable(); // easy, medium, hard
    table.integer("estimated_duration_hours").nullable();
    table.string("region").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.index("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("trips");
}
