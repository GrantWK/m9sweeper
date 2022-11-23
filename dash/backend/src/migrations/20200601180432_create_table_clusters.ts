import { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('clusters',(table)=>{
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.string('ip_address', 50).notNullable();
        table.string('port', 50).notNullable();
        table.string('api_key', 255).notNullable();
        table.integer('group_id').notNullable();
        table.string('context', 255).notNullable();
        table.jsonb('tags').nullable();
        table.bigInteger('created_at').notNullable().defaultTo(knex.raw('getCurrentUnixTimestamp() * 1000'));
        table.bigInteger('updated_at').nullable();
        table.bigInteger('deleted_at').nullable();
    });
}

export async function down(knex: Knex): Promise<any> {
    return Promise.resolve(true);
}
