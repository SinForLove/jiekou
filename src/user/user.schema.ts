import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop()
  APP账号: string;

  @Prop()
  手机号: string;

  @Prop()
  充值: string;
  @Prop()
  所属渠道: string;
  @Prop()
  注册日期: string;
  @Prop()
  注册ip: string;
  @Prop()
  最后登录时间: string;
  @Prop()
  最后登录IP: string;
  @Prop()
  注册游戏: string;
  @Prop()
  最近登陆游戏: string;
  @Prop()
  设备号: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
