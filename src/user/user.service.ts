import { Model } from "mongoose";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel, Prop } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto } from "./CreateUserDto";
import { KuaiShou, KuaiShouDocument } from "./kuaishou.schema";
import { KuaiShouDto } from "./KuaiShouDto";

const request = require("request");
const cheerio = require("cheerio");

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectModel("User") private readonly userModel: Model<UserDocument>, @InjectModel("KuaiShou") private readonly kuaiShouModel: Model<KuaiShouDocument>) {
    this.cookieDefault = "PHPSESSID=pib3lmp7upm9th8d1bteadc9f7; cps_tgid=hz30027; cps_user_auth=f669zTb%2BORl0j1wpvl1oSgTGp3cbyeZULx%2BnifGVb%2BzdDUGC%2F2eMOp%2BnolNgqqN3QzGAfKJ7%2B59kskKDgmHgYNxHoxaLCHbeviIf7BNl";
    this.url0 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=0";//当天
    this.url1 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=1";//昨天
    this.url2 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=2";//本周
    this.url3 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=3";//本月
    this.url4 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=4";//上月
    this.url5 = "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=5&username=&tel=";//自定义(默认全部)
  }

  cookieDefault: string;
  url0: string;//当天
  url1: string;//昨天
  url2: string;//本周
  url3: string;//本月
  url4: string;//上月
  url5: string;//自定义(默认全部)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    console.log(createUserDto);
    return createdUser.save();
  }

  async findAndUpdate(createUserDto: CreateUserDto, uploadToKuaiShou: false): Promise<User> {
    // console.log(createUserDto);
    let conditions = {
      "APP账号": createUserDto.APP账号
    };
    let options = {
      new: false,
      upsert: true
    };
    const dd = await this.userModel.findOneAndUpdate(conditions, createUserDto, options);
    if (!dd) {
      if (uploadToKuaiShou) {
        console.log("上传快手!");
        let ff = await this.kuaiShouModel.findOneAndUpdate({ HASCALLBACK: "0" }, { HASCALLBACK: "1" });
        if (ff) {
          console.log(ff);
        }
        else {
          ff = await this.kuaiShouModel.findOne({ CALLBACK: { $ne: null } });
          console.log("没有合适的用户,随意挑一个" + ff);
          if (!ff) {
          }
        }
        if(ff)
        {
          let encode_callback = ff.CALLBACK;//http://ad.partner.gifshow.com/track/activate?event_type=1&event_time=1536045380000&callback=DHAJASALKFyk1uCKBYCyXp-iIDS-uHDd_a5SJ9Dbwkqv46dahahd87TW7hhkJkd
          let decode_callback = decodeURIComponent(encode_callback);
          console.log("decode_callback=" + decode_callback);
          let callback = decode_callback.match(/\?.*/).toString();
          console.log("callback=" + callback);
          callback = callback.replace("?", "");
          console.log("callback=" + callback);
          let url = decode_callback.replace(callback, "");
          console.log("url=" + url);
          console.log( callback);
          let final = url + "event_type=1" + "&event_time=" + Date.now().toString() + "&" + callback;
          console.log("final=" + final);
          //发送请求
          request(final, function(error, response, body) {
            console.log(error + response + body);
          });
        }
        else
        {
          console.log("还是没有合适的用户! 估计是还没收到快手给的资料!");
        }
      }
      console.log("插入了一条新用户");
    }
    return dd;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  onModuleInit() {
    this.loopCheck(this);
    console.log=function(){};
  }

  async loopCheck(self) {
    let headers = {
      "Content-Type": "application/json",
      "Cookie": this.cookieDefault
    };

    let options = {
      // host: "HOST",  //ip
      // port: PORT,   //port
      url: "https://gh.tsyule.cn/index.php/Cpsbtgame/reglist?datetype=0",   //get方式使用的地址
      method: "GET", //get方式或post方式
      headers: headers
    };
    while (true) {
      this.getOnePageDataAndUpdate(self, self.cookieDefault, self.url0, true);
      await sleep(31000);
    }
  }

  async getOnePageDataAndUpdate(self, cookie, url, uploadToKuaiShou) {
    console.log("cookie=" + cookie + ";;;url=" + url);
    let headers = {
      "Content-Type": "application/json",
      "Cookie": cookie
    };

    let options = {
      // host: "HOST",  //ip
      // port: PORT,   //port
      url: url,   //get方式使用的地址
      method: "GET", //get方式或post方式
      headers: headers
    };
    request(options, async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        //   console.log(body) // Show the HTML for the baidu homepage.
        let $ = cheerio.load(body);
        let list = [];
        let trs = $("tr");
        console.log(trs.length);
        // tds.each((index, item)=>{
        //   let dd=$(item).text();
        //   list.push(dd);
        //   console.log(dd);
        // })
        for (let i = 0; i < trs.length; i++) {
          if (i === 0 || i === (trs.length - 1)) {

          } else {
            let children = $(trs[i]).children();
            let createUser = new CreateUserDto();
            createUser.APP账号 = $(children[0]).text();
            createUser.手机号 = $(children[1]).text();
            createUser.充值 = $(children[2]).text();
            createUser.所属渠道 = $(children[3]).text();
            createUser.注册日期 = $(children[4]).text();
            createUser.注册ip = $(children[5]).text();
            createUser.最后登录时间 = $(children[6]).text();
            createUser.最后登录IP = $(children[7]).text();
            createUser.注册游戏 = $(children[8]).text();
            createUser.最近登陆游戏 = $(children[9]).text();
            createUser.设备号 = $(children[10]).text();
            await self.findAndUpdate(createUser, uploadToKuaiShou);
          }
        }
      } else {
        console.log(error);
        console.log(response);
        console.log(body);
      }
    });
  }

  async createKuaiShou(kuaiShouDto: KuaiShouDto): Promise<KuaiShou> {
    const createdUser = new this.kuaiShouModel(kuaiShouDto);
    console.log(kuaiShouDto);
    return createdUser.save();
  }

  uploadToKuaiShou() {

  }
}

global.dd = "";

function sleep(t) {
  return new Promise(res => setTimeout(res, t));
}
