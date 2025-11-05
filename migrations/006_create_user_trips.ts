import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("user_trips");
  if (exists) return;
  await knex.schema.createTable("user_trips", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("start_lat", 10, 8).notNullable();
    table.decimal("start_lng", 11, 8).notNullable();
    table.decimal("dest_lat", 10, 8).notNullable();
    table.decimal("dest_lng", 11, 8).notNullable();
    table.decimal("distance_km", 8, 2).nullable();
    table.string("duration_text").nullable();
    table.string("offline_map_path").nullable();
    table.json("route_geojson").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["user_id", "created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user_trips");
}
