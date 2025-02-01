import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1738333345496 implements MigrationInterface {
    name = 'CreateTables1738333345496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "isBot" boolean NOT NULL, "chatId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_ae8951c0a763a060593606b7e2d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_ae8951c0a763a060593606b7e2d"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
