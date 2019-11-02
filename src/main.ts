import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {createConnection} from "typeorm";
import * as express from "express";

const server = createExpressServer({
    cors: true,
    controllers: [__dirname + "\\controllers\\*.ts"]
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const connect = async () => {

    await createConnection().then(connection => {
        server.listen(3333, () => {
            console.log('Server is running in 3333');
        });
    }).catch(error => console.error(error));

};

connect();