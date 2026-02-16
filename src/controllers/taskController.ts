import { Request, Response } from "express";
export const Test = (req: Request, res: Response) => {
  res.json({ "message": "hello world" })
}

