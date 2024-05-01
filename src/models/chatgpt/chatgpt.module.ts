import { Module } from '@nestjs/common';
import { ChatGPTService } from './chatgpt.service';
import { ChatGPTController } from './chatgpt.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ChatGPTService],
  controllers: [ChatGPTController],
  exports: [ChatGPTService],
})
export class ChatGPTModule {}
