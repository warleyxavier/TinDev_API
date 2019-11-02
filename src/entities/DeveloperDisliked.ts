import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";

@Entity("dislikes")
export default class DeveloperDisliked{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "developer_id"})
    developerId: number;

    @Column({name: "developer_disliked_id"})
    developerDisliked: number;

};