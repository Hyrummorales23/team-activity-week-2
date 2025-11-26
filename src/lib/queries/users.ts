import { z } from "zod";
import bcrypt from "bcrypt";
import postgres from "postgres";

import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema
} from "@/lib/validations/users";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createUser(input: z.infer<typeof createUserSchema>) {
  const data = createUserSchema.parse(input);

  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await sql`
    INSERT INTO users (
      type,
      name,
      email,
      passwordHash,
      profilePicture
    )
    VALUES (
      ${data.type},
      ${data.name},
      ${data.email},
      ${passwordHash},
      ${data.profilePicture}
    )
    RETURNING *;
  `;

  return result[0];
}

export async function updateUser(input: z.infer<typeof updateUserSchema>) {
  const data = updateUserSchema.parse(input);

  const updates: string[] = [];
  const values: any[] = [];

  if (data.type !== undefined) {
    updates.push(`type = $${updates.length + 1}`);
    values.push(data.type);
  }
  if (data.name !== undefined) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(data.name);
  }
  if (data.email !== undefined) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(data.email);
  }
  if (data.password !== undefined) {
    const hash = await bcrypt.hash(data.password, 10);
    updates.push(`passwordHash = $${updates.length + 1}`);
    values.push(hash);
  }
  if (data.profilePicture !== undefined) {
    updates.push(`profilePicture = $${updates.length + 1}`);
    values.push(data.profilePicture);
  }

  if (updates.length === 0) return null;

  values.push(data.userId);

  const result = await sql.unsafe(
    `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE userId = $${values.length}
      RETURNING *;
    `,
    values
  );

  return result[0];
}

//
// ------------------ DELETE USER ------------------
//
export async function deleteUser(input: z.infer<typeof deleteUserSchema>) {
  const { userId } = deleteUserSchema.parse(input);

  const result = await sql`
    DELETE FROM users
    WHERE userId = ${userId}
    RETURNING *;
  `;

  return result[0];
}