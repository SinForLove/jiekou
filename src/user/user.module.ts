import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.schema";
import { UserController } from './user.controller';
import { KuaiShou, KuaiShouSchema } from "./kuaishou.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),MongooseModule.forFeature([{ name: KuaiShou.name, schema: KuaiShouSchema }])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {


}
