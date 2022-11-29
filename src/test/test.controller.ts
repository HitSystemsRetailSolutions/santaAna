import { Body, Controller, Get } from "@nestjs/common";
import { recHit } from "src/conexion/mssql";
import { logger } from "../logger/logger.class";

@Controller("test")
export class TestController {
  @Get("test")
  async test(@Body() _params) {
    try {
      return recHit("Hit", "Select * from tocGameInfo")
        .then((res) => {
          return res.recordset;
        })
        .catch((err) => {
          return err.message;
        });
    } catch (err) {
      logger.Error(this.test.name, err);
      return false;
    }
  }
}
