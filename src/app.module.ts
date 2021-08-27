import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [HttpModule, UserModule,MongooseModule.forRoot('mongodb://localhost/companyInterface')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
