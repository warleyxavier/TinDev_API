import { EntityManager, getManager, In, Not } from "typeorm";

import Developer from "../entities/Developer";
import DeveloperController from "../controllers/DeveloperController";
import { isNullOrUndefined } from "util";
import { BadRequestError, HttpError } from "routing-controllers";
import DeveloperLiked from "../entities/DeveloperLiked";
import DeveloperDisliked from "../entities/DeveloperDisliked";

export default class DeveloperRepository {

    private manager: EntityManager = null;

    constructor() {
        this.manager = getManager();
    };

    public async insert(developer: Developer): Promise<Developer> {

        let name: string = developer.Name;

        return new Promise<Developer>(async (resolve, reject) => {

            let developerThatAlreadyExists: Developer = null;

            try {
                developerThatAlreadyExists = await this.manager.findOne(Developer, { where: { name } });
            } catch (error) {
                return reject(new HttpError(400, "Não foi possível verificar se o usuário já existe"));
            }

            if (developerThatAlreadyExists)
                return resolve(developerThatAlreadyExists);

            this.manager.save<Developer>(developer)
                .then(newDeveloper => resolve(newDeveloper))
                .catch(error => reject(error));

        });

    };

    findById(developerId: number): Promise<Developer> {

        return new Promise<Developer>(async (resolve, reject) => {

            let developer: Developer = null;

            try {

                developer = await this.manager.findOne(Developer, { where: { id: developerId } });

                if (isNullOrUndefined(developer))
                    return reject(new HttpError(404, "Desenvolvedor não encontrado"));

                let developersLiked: DeveloperLiked[] = await this.manager.find(DeveloperLiked, { where: { developerId: developerId } });
                developer.DevelopersLikedId = developersLiked.map(entity => entity.developerLiked);

                let developersDisliked: DeveloperDisliked[] = await this.manager.find(DeveloperDisliked, { where: { developerId: developerId } });
                developer.DevelopersDislikedId = developersDisliked.map(entity => entity.developerDisliked);

                return resolve(developer);
            } catch (error) {
                return reject(new HttpError(400, error.message));
            }

        });

    }

    likeDeveloper(developerId, developerLikedId: number): Promise<Developer> {

        return new Promise<Developer>(async (resolve, reject) => {

            try {
                await this.findById(developerId);
                await this.findById(developerLikedId);
            } catch (error) {
                return reject(new HttpError(404, "Desenvolvedor não encontrado"));
            }

            let like: DeveloperLiked = new DeveloperLiked();
            like.developerId = developerId;
            like.developerLiked = developerLikedId;

            this.manager.save<DeveloperLiked>(like)
                .then(() => resolve(this.findById(developerId)))
                .catch(error => reject(error));

        });

    };

    dislikeDeveloper(developerId, developerDislikedId: number): Promise<Developer> {

        return new Promise<Developer>(async (resolve, reject) => {

            try {
                await this.findById(developerId);
                await this.findById(developerDislikedId);
            } catch (error) {
                return reject(new HttpError(404, "Desenvolvedor não encontrado"));   
            }

            let dislike = new DeveloperDisliked();
            dislike.developerId = developerId;
            dislike.developerDisliked = developerDislikedId;

            this.manager.save<DeveloperDisliked>(dislike)
                .then(() => resolve(this.findById(developerId)))
                .catch(error => reject(error));

        });

    };

    findDevelopersListByDeveloper(developerId: number): Promise<Developer[]> {

        return new Promise<Developer[]>(async (resolve, reject) => {

            let developer: Developer = null;

            try {
                developer = await this.findById(developerId);
            } catch (error) {
                return reject(new HttpError(404, "Desenvolvedor não encontrado"));   
            };

            try {

                let IdsToExclude: number[] = [developer.Id].concat(developer.DevelopersLikedId.concat(developer.DevelopersDislikedId));

                IdsToExclude = IdsToExclude.filter(value => {
                    if (!isNullOrUndefined(value))
                        return value;
                });

                let developers: Developer[] = await this.manager.find(Developer, 
                    {id: Not(In(IdsToExclude))}
                );

                resolve(developers);
            } catch (error) {
                reject(error);    
            };          

        });        

    };

};