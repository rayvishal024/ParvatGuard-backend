import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("trip_packs", (table) => {
    table.json("waypoints").nullable(); // [{lat,lng,label}]
    table.json("gallery_urls").nullable(); // [string]
    table.text("guide_text").nullable();
    table.text("offline_advisory").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("trip_packs", (table) => {
    table.dropColumn("waypoints");
    table.dropColumn("gallery_urls");
    table.dropColumn("guide_text");
    table.dropColumn("offline_advisory");
  });
}
