import { Module } from "@nestjs/common";
import { InMemoryDB } from "./in-memory.db";

@Module({
    providers: [InMemoryDB],
    exports: [InMemoryDB],
})
export class StorageModule { }