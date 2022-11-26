import { Body, Controller, Get } from "@nestjs/common";
import { logger } from "../logger/logger.class";

@Controller("test")
export class TestController {
  @Get("test")
  async test(@Body() _params) {
    try {
      throw Error("Error de prueba para el logger con nombre propio");
    } catch (err) {
      logger.Error(test.name, err);
      return false;
    }
  }
}
