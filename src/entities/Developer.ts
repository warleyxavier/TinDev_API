import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity("developers")
export default class Developer {

    @PrimaryGeneratedColumn({name: "id"})
    id: number;

    @Column({name: "name"})
    private name: string;

    @Column({name: "user_github"})
    private user: string;

    @Column({name: "bio"})
    private bio: string;

    @Column({name: "avatar"})
    private avatar: string;

    private developersLikedId: number[];

    private developersDislikedId: number[];

    get Id(): number {
        return this.id;
    };

    set Id(value: number) {
        this.id = value;
    };

    get Name(): string {
        return this.name;
    };

    set Name(value: string) {
        this.name = value;
    };

    get User(): string {
        return this.user;
    };

    set User(value: string) {
        this.user = value;
    };

    get Bio(): string {
        return this.bio;
    };

    set Bio(value: string) {
        this.bio = value;
    };

    get Avatar(): string {
        return this.avatar;
    };

    set Avatar(value: string) {
        this.avatar = value;
    };

    get DevelopersLikedId(): number[] {
        return this.developersLikedId;
    };

    set DevelopersLikedId(value: number[]) {
        this.developersLikedId = value;
    };

    get DevelopersDisikedId(): number[] {
        return this.developersDislikedId;
    };

    set DevelopersDislikedId(value: number[]) {
        this. developersDislikedId = value;
    };

};