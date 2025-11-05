import type { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("emergency_contacts").del();
  await knex("alerts").del();
  await knex("users").del();

  // Hash password for admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  // Insert seed users
  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@parvatguard.com",
      password_hash: adminPasswordHash,
      name: "Admin User",
      phone: "+1234567890",
      default_sos_message:
        "Emergency SOS: I need immediate help. Please find me at the location below.",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      email: "test@example.com",
      password_hash: await bcrypt.hash("test123", 10),
      name: "Test User",
      phone: "+0987654321",
      default_sos_message: "Help! I am in danger.",
    },
  ]);

  // Insert emergency contacts for admin
  await knex("emergency_contacts").insert([
    {
      id: "10000000-0000-0000-0000-000000000001",
      user_id: "00000000-0000-0000-0000-000000000001",
      name: "Emergency Contact 1",
      phone: "+1111111111",
      relationship: "Family",
      is_primary: true,
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      user_id: "00000000-0000-0000-0000-000000000001",
      name: "Emergency Contact 2",
      phone: "+2222222222",
      relationship: "Friend",
      is_primary: false,
    },
  ]);
}
