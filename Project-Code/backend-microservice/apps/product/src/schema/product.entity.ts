import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, Decimal128 } from 'typeorm';
import { ProductSize } from '../constants';


@Entity("products")
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    @Index()
    name: string;

    @Column({ length: 50, nullable: true })
    short_description: string

    @Column({ length: 100, nullable: true })
    description: string

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ProductSize,
        array: true,
    })
    sizes: ProductSize[]

    @Column('text', { array: true })
    colors: String[]

    @Column({ length: 36, nullable: true })
    category_slug: String

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
