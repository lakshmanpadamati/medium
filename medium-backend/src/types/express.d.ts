import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with a more specific type for your decoded JWT payload
    }
  }
}
