import { NestFactory } from '@nestjs/core'
import { DocumentBuilder } from '@nestjs/swagger'
import { SwaggerModule } from '@nestjs/swagger/dist'
import { AppModule } from './app.module'
declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3000
  app.setGlobalPrefix('api/v1')

  const config = new DocumentBuilder()
    .setTitle('Sleact Api')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
