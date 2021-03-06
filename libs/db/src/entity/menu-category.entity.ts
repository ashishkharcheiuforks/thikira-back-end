import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Restaurant } from './restaurant.entity';
import { stringify } from 'querystring';

@Entity()
export class MenuCategory {
  @PrimaryGeneratedColumn()
  public readonly mc_id: number;
  @Column()
  public readonly mc_name: string;
  @OneToMany(() => Menu, (menu: Menu) => menu.menu_category)
  public readonly menu: Menu[];
  @ManyToOne(
    () => Restaurant,
    (restaurant: Restaurant) => restaurant.menu_category,
    { nullable: false },
  )
  @JoinColumn({ name: 'f_r_id' })
  public readonly restaurant: Restaurant;

  constructor(menu_category?, param?) {
    if (menu_category instanceof MenuCategory) {
      Object.assign(this, menu_category);
    } else if (menu_category !== undefined) {
      if (param instanceof Restaurant) {
        this.mc_name = menu_category.name;
        this.restaurant = param;
      }
    }
  }

  public is_empty(): boolean {
    return !this.mc_name;
  }

  public get(): string {
    return stringify({
      name: this.mc_name,
    });
  }
}
