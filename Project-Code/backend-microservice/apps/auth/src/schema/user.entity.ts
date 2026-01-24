import { UserRole } from 'apps/common/enum/auth/user-role.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 20 })
    firstName: string;

    @Column({ length: 20, nullable: true })
    middleName: string;

    @Column({ length: 20 })
    lastName: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ enum: UserRole, default: UserRole.BUYER })
    roles: string;

    @Column({ unique: true, length: 50 })
    @Index()
    email: string;

    @Column({ length: 100 })
    password: string;

    @Column({ length: 100, nullable: true })
    refreshToken: string | null;

    @Column({ length: 36, default: "" })
    cartId: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
    })
    updatedAt: Date;
}
