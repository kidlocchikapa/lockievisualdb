import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from '../entities/contact.entity';
import { EmailModule } from '../email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact]),
        EmailModule
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService]
})
export class ContactModule { }
