import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { RoleStatus } from "src/enum/enum";
import { Task } from "../tasks/tasks.entity";
import { classToPlain, Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column()
    salt: string;

    @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.USER })
    role: RoleStatus;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    toJSON() {
        return classToPlain(this);
      }
}