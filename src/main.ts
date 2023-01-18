import { NestFactory } from '@nestjs/core'
import { DocumentBuilder } from '@nestjs/swagger'
import { SwaggerModule } from '@nestjs/swagger/dist'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './HttpException.filter'
import { ValidationPipe } from '@nestjs/common'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3000
  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Sleact Api')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  )
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(port)
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  console.log(`app listen on port : ${port}`)
}
bootstrap()
