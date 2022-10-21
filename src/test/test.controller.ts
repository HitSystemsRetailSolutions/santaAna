import { Body, Controller, Post } from "@nestjs/common";
import { authInstance } from "../auth/auth.class";

@Controller("test")
export class TestController {
  @Post("test")
  async test(@Body() _params) {
    try {
      return await authInstance.checkToken(
        "79BCD15E-6AA2-4C9D-9BAD-0761A3B49F9D",
        "Fac_tena",
        115
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
