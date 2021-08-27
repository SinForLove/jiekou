import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KuaiShouDocument = KuaiShou & Document;
@Schema()
export class KuaiShou {
  @Prop()
  ACCOUNTID: string;
  @Prop()
  AID: string;
  @Prop()
  CID: string;
  @Prop()
  DID: string;
  @Prop()
  DNAME: string;
  @Prop()
  IMEI2: string;
  @Prop()
  IDFA2: string;
  @Prop()
  MAC2: string;
  @Prop()
  ANDROIDID2: string;
  @Prop()
  OS: string;
  @Prop()
  TS: string;
  @Prop()
  IP: string;
  @Prop()
  CSITE: string;
  @Prop()
  CALLBACK: string;
  @Prop()
  MODEL: string;
  @Prop()
  AC_CREATIVE: string;
  @Prop()
  HASCALLBACK: string;//是否已经匹配过了
}

export const KuaiShouSchema = SchemaFactory.createForClass(KuaiShou);
