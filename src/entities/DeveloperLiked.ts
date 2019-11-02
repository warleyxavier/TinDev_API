import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";

@Entity("likes")
export default class DeveloperLiked{

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "developer_id"})
    developerId: number;

    @Column({name: "developer_liked_id"})
    developerLiked: number;

};