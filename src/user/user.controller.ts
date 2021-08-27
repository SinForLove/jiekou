import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { KuaiShouDto } from "./KuaiShouDto";

@Controller('user')
export class UserController {
  constructor(private userService:UserService) {
  }
  @Get('/init123')//初始化数据库,将已存在的用户都储存起来
  init() {
    this.userService.getOnePageDataAndUpdate(this.userService,this.userService.cookieDefault,this.userService.url5+"&p=1",false)
    this.userService.getOnePageDataAndUpdate(this.userService,this.userService.cookieDefault,this.userService.url5+"&p=2",false)
    return '初始化完成';
  }
  @Get('/passKuaiShouClickEvent')//我给快手的接口 ?ACCOUNTID=__ACCOUNTID__&AID=__AID__&CID=__CID__&DID=__DID__&DNAME=__DNAME__&IMEI2=__IMEI2__&IDFA2=__IDFA2__&MAC2=__MAC2__&ANDROIDID2=__ANDROIDID2__&OS=__OS__&TS=__TS__&IP=__IP__&CSITE=__CSITE__&CALLBACK=__CALLBACK__&MODEL=__MODEL__&AC_CREATIVE=__AC_CREATIVE__
  passKuaiShou(@Query() query:KuaiShouDto) {
    query.HASCALLBACK='0';
    if(!query.CALLBACK)
      return '请传入CALLBACK参数'
    if(query.CALLBACK.toString().indexOf('http')===-1)
      return '请传入正确的CALLBACK地址'
    this.userService.createKuaiShou(query)
    return '上传用户信息完成';
  }
  @Get('/test')
  test(@Query() query:KuaiShouDto) {
    query.HASCALLBACK='0';
    this.userService.getOnePageDataAndUpdate(this.userService,this.userService.cookieDefault,this.userService.url5+"&p=2",true)
    return '测试完成';
  }
  @Get('/test2')//临时测试
  test2(@Query() query:KuaiShouDto) {
    query.HASCALLBACK='0';
    this.userService.getOnePageDataAndUpdate(this.userService,this.userService.cookieDefault,this.userService.url5+"&p=2",true)
    return '测试完成';
  }
}
