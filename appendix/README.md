# 附錄：LINE Notify 替代方案

## 前言

根據 LINE Notify 的 [結束服務公告](https://notify-bot.line.me/closing-announce)，LINE Notify 將於 2025 年 4 月停止運作。為確保系統通知功能能夠持續運行，LINE 官方建議開發者改用 LINE Messaging API 取代 LINE Notify。然而，LINE Messaging API 為付費服務，因此我們提供了 Telegram 和 Discord 的替代方案，協助您實現與 LINE Notify 相似的通知功能，確保通知服務的持續運作。

## 目錄

- [事前準備](#事前準備)
  - [設定 LINE Bot](#設定-line-bot)
  - [設定 Telegram Bot](#設定-telegram-bot)
  - [設定 Discord Bot](#設定-discord-bot)
- [實作 Notifier 模組](#實作-notifier-模組)
  - [定義 Notifier 服務](#定義-notifier-服務)
  - [實作 LINE Notifier](#實作-line-notifier)
  - [實作 Telegram Notifier](#實作-telegram-notifier)
  - [實作 Discord Notifier](#實作-discord-notifier)
  - [整合 Notifier 服務](#整合-notifier-服務)
- [使用 Notifier 服務](#使用-notifier-服務)

## 事前準備

在開始實作之前，需要先完成一些前置設定，具體步驟可根據你所選擇的平台進行操作。

---

### 設定 LINE Bot

LINE Bot 是一種自動化的聊天機器人，能透過 LINE 平台與使用者進行互動。若要使用 LINE Bot 的主動回報通知功能，您需要先申請 [LINE Messaging API](https://developers.line.biz/en/services/messaging-api/)。

| INFO: |
| :--- |
| LINE Messaging API 是由 LINE 提供的應用程式介面，讓開發者能與 LINE 用戶互動。透過此 API，開發者可以建立聊天機器人（Chatbot），自動在 LINE 平台上傳送與接收訊息，進行從單向通知到雙向溝通等多種操作。每月可免費發送一定數量的訊息，免費額度取決於您的 [LINE 官方帳號訂閱方案](https://developers.line.biz/en/docs/messaging-api/overview/#line-official-account-plan)。 |

#### 申請 LINE Messaging API

1. 前往 [LINE Developers](https://developers.line.biz/) 平台，使用您的 LINE 帳號登入。如尚未擁有 LINE 帳號，請先註冊，並以該帳號登入 LINE Developers 平台。
  ![](../img/line-01.png)

2. 登入後，點擊右上角的「Console」進入管理介面，從左側選單中選擇「Providers」，點擊「Create」，並輸入提供者名稱來建立新的 Provider。
  ![](../img/line-02.png)

3. 完成 Provider 建立後，選擇「Create a Messaging API Channel」來建立 Messaging API Channel。
  ![](../img/line-03.png)

4. 如果您尚未擁有 LINE 官方帳號，請前往 LINE Official Account Manager 申請官方帳號，並將此帳號連接至 Messaging API Channel。
  ![](../img/line-04.png)

5. 按指示填寫 LINE 官方帳號的相關資訊。
  ![](../img/line-05.png)

6. 確認輸入的所有資訊無誤後繼續。
  ![](../img/line-06.png)

7. 申請完成後，點擊「前往 LINE Official Account Manager」進行後續設定。
  ![](../img/line-07.png)

8. 進入 LINE Official Account Manager 時，您需同意 LINE 資料使用條款。請詳閱條款內容後點擊「同意」。
  ![](../img/line-08.png)

9. 進入 LINE Official Account Manager 後，點擊右上角的「設定」，從左側選單中選擇「Messaging API」後，點選「啟用 Messaging API」。
  ![](../img/line-09.png)

10. 在啟用 Messaging API 時，選擇您先前在 LINE Developers 建立的 Provider。
  ![](../img/line-10.png)

11. 確認帳號名稱與對應的提供者名稱正確後，點擊「確定」。
  ![](../img/line-11.png)

12. 返回 LINE Developers Console，進入您剛建立的 Provider 設定頁面。
  ![](../img/line-12.png)

13. 在「Basic settings」頁籤下找到「Your user ID」，請記下此 ID，它將用於將訊息發送至您自己。
  ![](../img/line-13.png)

14. 在「Messaging API」頁籤中，點擊「Issue」來生成一個長期有效的 Channel Access Token，此 Token 用於 API 請求的驗證。
  ![](../img/line-14.png)

---

### 設定 Telegram Bot

Telegram Bot 是一種自動化的聊天機器人，能透過 Telegram 平台與使用者進行互動。若要使用 Telegram Bot 的主動回報通知功能，您需要先申請 Telegram 帳號並建立 Telegram Bot。

#### 建立 Telegram Bot

1. 打開 Telegram，搜尋「BotFather」並開始對話。
  ![](../img/telegram-01.png)

2. 輸入 `/newbot`，依照指示設定你的 Bot 名稱和使用者名稱。
  ![](../img/telegram-02.png)

3. 完成後，BotFather 會提供一個 token，這是你與 Telegram API 溝通的密鑰。
  ![](../img/telegram-03.png)

4. 在 Telegram 中搜尋「userinfobot」，並開始對話。
  ![](../img/telegram-04.png)

5. 輸入 `/start`，Bot 會回應你一條訊息，內容包含你的使用者資訊，其中就有你的 user id。
  ![](../img/telegram-05.png)

---

### 設定 Discord Bot

Discord Bot 是一個自動化工具，能夠在 Discord 伺服器中執行多種任務，如管理頻道、回應指令等，提升用戶的互動體驗。如果您想使用此功能，需先完成以下步驟，包括申請 Discord 帳號、建立 Discord 伺服器、設置開發者應用程式，並將 Bot 加入伺服器以及取得使用者 ID。

#### 一、建立 Discord 伺服器

1. 前往 [Discord](https://discord.com) 網站，登入你的 Discord 帳號後，點選「開啟 Discord」。
  ![](../img/discord-01.png)

2. 在 Discord 主頁左側選單中，點擊「＋」按鈕以建立新的伺服器。
  ![](../img/discord-02.png)

3. 輸入伺服器名稱後，點擊「建立」完成伺服器建立。
  ![](../img/discord-03.png)

#### 二、建立 Discord 開發者應用程式

1. 進入 Discord Developer Portal，登入你的 Discord 帳戶，建立新的開發者應用程式。
  ![](../img/discord-04.png)

2. 輸入應用程式名稱，勾選同意條款，然後點擊「Create」按鈕。
  ![](../img/discord-05.png)

3. 應用程式建立完成後，於左側選單選擇「Bot」，開啟並設置相關權限。
  ![](../img/discord-06.png)

4. 點擊「Reset Token」按鈕，產生新的 Token。
  ![](../img/discord-07.png)

5. Token 會顯示在下方，請妥善記錄，後續設置中將會使用。
  ![](../img/discord-08.png)

#### 三、將 Discord Bot 加入伺服器

1. 在應用程式的左側選單中，選擇「OAuth 2」，於 Scope 表單中勾選「bot」。
  ![](../img/discord-09.png)

2. 在 Bot Permissions 表單中選擇「Administrator」以開啟所有權限。
  ![](../img/discord-10.png)

3. 複製「Generated URL」網址，並在瀏覽器開啟。
  ![](../img/discord-11.png)

4. 授權機器人加入您的伺服器。
  ![](../img/discord-12.png)

5. 確認授權權限，然後點擊「授權」。
  ![](../img/discord-13.png)

6. 授權完成後，關閉分頁。
  ![](../img/discord-14.png)

7. 回到伺服器，您會看到剛剛加入的 Bot 已經出現在成員列表中。
  ![](../img/discord-15.png)

#### 四、取得您的使用者 ID

1. 點擊 Discord 左下角的「使用者設定」圖示。
  ![](../img/discord-16.png)

2. 選擇左側選單的「進階」，並啟用開發者模式。
  ![](../img/discord-17.png)

3. 回到 Discord 主頁，右鍵點擊您的使用者名稱，選擇「複製 ID」以取得您的使用者 ID。
  ![](../img/discord-18.png)

## 實作 Notifier 模組

完成事前準備後，即可開始實作並整合各平台的通知服務。請打開終端機，使用以下 Nest CLI 指令：

```sh
$ nest g lib core
```

執行後，Nest CLI 將在專案 `libs` 目錄下新增 `core` 資料夾與相關檔案，

| INFO: |
| :--- |
| Nest CLI 預設將會建立 `core.module.ts`、`core.service.ts`、`core.service.spec.ts` 檔案，此處不會使用，可自行移除。 |

我們需要建立一個模組整合各平台的通知服務。請打開終端機，透過 Nest CLI 建立 `NotifierModule`：

```sh
$ nest g module notifier -p core 
```

執行後，Nest CLI 將在專案的 `libs/core/src` 目錄下新增一個名為 `notifier` 的資料夾，並在其中建立 `notifier.module.ts` 檔案。

### 定義 Notifier 服務

接下來，我們需要為各平台的通知服務定義一個共通介面。請在 `libs/core/src/notifier` 目錄下新增 `notifier.service.ts` 檔案，定義 `NotifierService`：

```ts
export abstract class NotifierService {
  abstract send(message: string): any;
}
```

這個是一個抽象類別，我們將會在各平台的通知服務實作這個介面。

### 實作 LINE Notifier

為了整合 LINE Bot 服務，請開啟終端機安裝以下套件：

```sh
$ npm install --save nest-line-bot @line/bot-sdk
```

安裝完成後，請在 `libs/core/src/notifier` 目錄下新增 `line` 資料夾，在此處建立 `line-notifier.service.ts` 檔案，並加入以下程式碼：

```ts
import * as line from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { InjectLineMessagingApiClient } from 'nest-line-bot';
import { NotifierService } from '../notifier.service';

@Injectable()
export class LineNotifierService implements NotifierService {
  constructor(
    @InjectLineMessagingApiClient() private readonly line: line.messagingApi.MessagingApiClient,
  ) {}

  async send(message: string) {
    return this.line.pushMessage({
      to: process.env.LINE_USER_ID,
      messages: [{ type: 'text', text: message }],
    });
  }
}
```

完成後，請在 `libs/core/src/notifier/line` 目錄下新增 `line-notifier.module.ts` 檔案，並加入以下程式碼：

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LineBotModule } from 'nest-line-bot';
import { LineNotifierService } from './line-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    LineBotModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        channelAccessToken: configService.get('LINE_CHANNEL_ACCESS_TOKEN'),
        channelSecret: configService.get('LINE_CHANNEL_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: LineNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class LineNotifierModule {}
```

在 `LineNotifierModule` 中，我們匯入 `LineBotModule` 模組，並指定 `LineNotifierService` 作為 `NotifierService`。

### 實作 Telegram Notifier

為了整合 Telegram Bot 服務，請開啟終端機安裝以下套件：

```sh
$ npm install --save nestjs-telegraf telegraf
```

安裝完成後，請在 `libs/core/src/notifier` 目錄下新增 `telegram` 資料夾，在此處建立 `telegram-notifier.service.ts` 檔案，並加入以下程式碼：

```ts
import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { NotifierService } from '../notifier.service';

@Injectable()
export class TelegramNotifierService implements NotifierService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  async send(message: string) {
    return this.bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, message);
  }
}
```

完成後，請在 `libs/core/src/notifier/telegram` 目錄下新增 `telegram-notifier.module.ts` 檔案，並加入以下程式碼：

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramNotifierService } from './telegram-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: TelegramNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class TelegramNotifierModule {}
```

在 `TelegramNotifierModule` 中，我們匯入 `TelegrafModule` 模組，並指定 `TelegramNotifierService` 作為 `NotifierService`。

### 實作 Discord Notifier

為了整合 Discord Bot 服務，請開啟終端機安裝以下套件：

```sh
$ npm install --save necord discord.js
```

安裝完成後，請在 `libs/core/src/notifier` 目錄下新增 `discord` 資料夾，在此處建立 `discord-notifier.service.ts` 檔案，並加入以下程式碼：

```ts
import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { NotifierService } from '../notifier.service';

@Injectable()
export class DiscordNotifierService implements NotifierService {
  constructor(private readonly client: Client) {}

  async send(message: string) {
    const user = await this.client.users.fetch(process.env.DISCORD_USER_ID);
    const dmChannel = await user.createDM();
    return dmChannel.send(message);
  }
}
```

完成後，請在 `libs/core/src/notifier/discord` 目錄下新增 `discord-notifier.module.ts` 檔案，並加入以下程式碼：

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import { DiscordNotifierService } from './discord-notifier.service';
import { NotifierService } from '../notifier.service';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('DISCORD_BOT_TOKEN'),
        intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: NotifierService,
      useClass: DiscordNotifierService,
    },
  ],
  exports: [
    NotifierService,
  ],
})
export class DiscordNotifierModule {}
```

在 `DiscordNotifierModule` 中，我們匯入 `NecordModule` 模組，並指定 `DiscordNotifierService` 作為 `NotifierService`。

### 整合 Notifier 服務

完成各平台的通知介面實作後，我們要將這些平台服務進行整合。請在 `libs/core/src/notifier` 目錄下新增 `notifier.enum.ts` 檔案，定義 `Notifier` 列舉（Enum）類型，用來表示 Notifier 的平台服務類別：

```ts
export enum Notifier {
  Line = 'line',
  Telegram = 'telegram',
  Discord = 'discord',
}
```

接著，請在 `libs/core/src/notifier` 目錄下開啟 `notifier.module.ts` 檔案，並加入以下程式碼：

```ts
import { Global, Module } from '@nestjs/common';
import { Notifier } from './notifier.enum';
import { LineNotifierModule } from './line/line-notifier.module';
import { TelegramNotifierModule } from './telegram/telegram-notifier.module';
import { DiscordNotifierModule } from './discord/discord-notifier.module';

@Global()
@Module({})
export class NotifierModule {
  static use(notifier: Notifier) {
    const modules = {
      [Notifier.Line]: LineNotifierModule,
      [Notifier.Telegram]: TelegramNotifierModule,
      [Notifier.Discord]: DiscordNotifierModule,
    };
    const notifierModule = modules[notifier];
    return {
      module: NotifierModule,
      imports: [notifierModule],
      exports: [notifierModule],
    };
  }
}
```

最後，您可以在 `libs/core/src/notifier` 新增 `index.ts` 檔案，將相關檔案匯出：

```ts
export * from './notifier.enum';
export * from './notifier.module';
export * from './notifier.service';
```

如此，你可以在 `AppModule` 匯入 `NotifierModule` 並使用 `use()` 方法，選擇要使用的平台通知服務。

## 使用 Notifier 服務

為了啟用通知服務，需要先進行環境變數設定。請在專案目錄下的 `.env` 檔案中，選用你要使用的平台通知服務：

```
NOTIFIER_SERVICE=

LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
LINE_USER_ID=

TELEGRAM_BOT_TOKEN=
TELEGRAM_USER_ID=

DISCORD_BOT_TOKEN=
DISCORD_USER_ID=
```

這些變數所代表的意義與用途如下

- `NOTIFIER_SERVICE`：選用的平台通知服務，可選 `line`、`telegram`、`discord`。
- `LINE_CHANNEL_ACCESS_TOKEN`：你的 LINE Channel Access Token。
- `LINE_CHANNEL_SECRET`：你的 LINE Channel Secret。
- `LINE_USER_ID`：你的 LINE User ID。
- `TELEGRAM_BOT_TOKEN`：你的 Telegrm Bot Token。
- `TELEGRAM_USER_ID`：你的 Telegrm User ID。
- `DISCORD_BOT_TOKEN`：你的 Discord Bot Token。
- `DISCORD_USER_ID`：你的 Discord User ID。

你需要將這些環境變數的值填入，才能讓應用程式正常運作。

以下將以 `trader` 應用程式為例，示範如何使用 `NotifierModule` 啟用通知服務。請開啟 `apps/trader/src/app.module.ts` 檔案，加入以下程式碼：

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { FugleMarketDataModule } from '@fugle/marketdata-nest';
import { FugleTradeModule } from '@fugle/trade-nest';
import { IpFilter } from 'nestjs-ip-filter';
import { Notifier, NotifierModule } from '@app/core/notifier';
import { TraderModule } from './trader/trader.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    FugleMarketDataModule.forRoot({
      apiKey: process.env.FUGLE_MARKETDATA_API_KEY,
    }),
    FugleTradeModule.forRoot({
      config: {
        apiUrl: process.env.FUGLE_TRADE_API_URL,
        certPath: process.env.FUGLE_TRADE_CERT_PATH,
        apiKey: process.env.FUGLE_TRADE_API_KEY,
        apiSecret: process.env.FUGLE_TRADE_API_SECRET,
        aid: process.env.FUGLE_TRADE_AID,
        password: process.env.FUGLE_TRADE_PASSWORD,
        certPass: process.env.FUGLE_TRADE_CERT_PASS,
      },
    }),
    IpFilter.register({
      whitelist: String(process.env.ALLOWED_IPS).split(','),
    }),
    TraderModule,
    PlanModule,
  ],
})
export class AppModule {
  static register(options: { notifier: Notifier }) {
    return {
      module: AppModule,
      imports: [NotifierModule.use(options.notifier)],
    };
  }
}
```

由於 LINE Notify 服務於 2025 年 4 月停止運作，我們移除了 `LineNotifyModule` 的依賴，取而代之的是加入了 `register()` 方法匯入 `NotifierModule`，並且可指定要啟用的平台通知服務。

接著，開啟 `apps/trader/src/main.ts` 檔案，加入以下程式碼：

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Notifier } from '@app/core/notifier';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.register({ notifier: process.env.NOTIFIER_SERVICE as Notifier })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
```

然後，您可以透過依賴注入 `NotifierService` 來發送通知訊息，以下是一個簡單的例子：

```ts
import { Injectable } from '@nestjs/common';
import { NotifierService } from '@app/core/notifier';

@Injectable()
export class AppService {
  constructor(
    private readonly notifierService: NotifierService,
  ) {}

  async sendNotification(message: string) {
    return this.notifierService.send(message);
  }
}
```

更多詳細的應用，請參考 [appendix](./) 範例程式碼。

## 結語

隨著 LINE Notify 服務即將於 2025 年 4 月停止運作，若開發者希望繼續透過 LINE 推送通知，官方建議考慮轉移至 LINE Messaging API。Messaging API 提供了更豐富的功能和彈性，允許更客製化的通知方式，但進階功能可能會產生額外費用。因此，我們同時提供了 Telegram 和 Discord 的替代方案。在考量系統需求與功能擴展的同時，應評估各方案的成本，以選擇最符合系統需求與預算的解決方案，確保系統運作順暢。
