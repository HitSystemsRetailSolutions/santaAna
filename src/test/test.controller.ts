import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { authInstance } from "../auth/auth.class";
import { Response } from "express";
@Controller("test")
export class TestController {
  @Post("test")
  async test(
    @Body() _params,
    @Request() req,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      return await authInstance.getParametros(req.headers.authorization);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.FORBIDDEN);
      return false;
    }
  }
}
