import { Knex } from 'knex';


export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable('docker_registries', (table) => {
        table.dropUnique(['hostname']);
    });
}


export async function down(knex: Knex): Promise<any> {
    return Promise.resolve(true);
}

