/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Prisma } from "src/generated/prisma/client";
import express from 'express'

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export const extractRefreshTokenFromCookie = (req: express.Request):string | null => {
  if(req && req.cookies){
    return req.cookies['refreshToken']
  }
  return null
}