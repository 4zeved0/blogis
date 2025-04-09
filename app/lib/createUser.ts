'use server'

import { prisma } from "./prisma/prisma";

export default async function createUser(email: string, name: string, surname: string) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        surname: surname,
      }
    });

    return newUser;
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    throw new Error("Erro ao criar usuário");
  }
}
