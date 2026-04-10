import { Module } from '@nestjs/common';

import { PrismaModule } from '../prismaService/prisma.module';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
