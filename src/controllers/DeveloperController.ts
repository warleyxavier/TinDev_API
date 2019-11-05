import { JsonController, Get, Body, Param, Post, Req, Res } from "routing-controllers";
import { isNullOrUndefined } from "util";
import axios from "axios";

import Developer from "../entities/Developer";
import DeveloperRepository from "../repositories/DeveloperRepository";

@JsonController("/developer")
export default class DeveloperController {

    private repository: DeveloperRepository = null;

    constructor() {
        this.repository = new DeveloperRepository();
    };

    @Post("/")
    async insert(@Body() developer: Developer) {

        const response = await axios.get(`https://api.github.com/users/${developer.User}`);

        const {name, bio, avatar_url} = response.data;

        developer.Name = name;
        developer.Bio = bio;
        developer.Avatar = avatar_url;

        return await this.repository.insert(developer);
    }

    @Get("/find/:id")
    async findDeveloperById(@Param("id") developerId: number) {
        return await this.repository.findById(developerId);
    };

    @Post("/like/:developerLikedId")
    likeDeveloper(@Param("developerLikedId") developerLikedId: number, @Req() request: any, @Res() response: any) {

        let token: string = request.headers.authorization;

        if (isNullOrUndefined(token) || token.length == 0)
            return response.json(400, { message: "Token de autenticação não encontrado" });

        const developerId = Number.parseInt(token);

        if (developerId == developerLikedId)
            return response.json(400, { message: "Você não pode dar like em você mesmo" });

        return this.repository.likeDeveloper(developerId, developerLikedId)

    };

    @Post("/dislike/:developerDislikedId")
    dislikeDeveloper(@Param("developerDislikedId") DeveloperDislikedId: number, @Req() request: any, @Res() response: any) {

        let token: string = request.headers.authorization;

        if (isNullOrUndefined(token) || token.length == 0)
            return response.json(400, { message: "Token de autenticação não encontrado" });

        const developerId = Number.parseInt(token);

        if (developerId == DeveloperDislikedId)
            return response.json(400, { message: "Você não pode dar dislike em você mesmo" });   

        return this.repository.dislikeDeveloper(developerId, DeveloperDislikedId);

    };

    @Get("/developers")
    findDevelopers(@Req() request: any, @Res() response: any) {
     
        let token: string = request.headers.authorization;

        if (isNullOrUndefined(token) || token.length == 0)
            return response.json(400, { message: "Token de autenticação não encontrado" });

        const developerId = Number.parseInt(token);        

        return this.repository.findDevelopersListByDeveloper(developerId);

    };


};