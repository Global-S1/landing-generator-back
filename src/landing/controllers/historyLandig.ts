import { NextFunction, Request, Response } from "express";
import { DB } from "../../db"

const db = new DB()

export const historyLandigCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await db.earlierVersion()

    const { data, sections } = await db.getTemplate()

    res.json({
      template: data,
      sections
    })
  } catch (error) {
    next(error)
  }
}