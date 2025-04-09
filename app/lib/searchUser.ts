'use server'

import { prisma } from "./prisma/prisma";

export default async function searchUser(email: string) {
  try {
    const search = prisma.user.findUnique({
      where: {
        email: email
      }
    })
    return search
  }
  catch (err) {
    console.log(err);
  }
}