import { POS } from 'src/brands/stores/pos/pos.entity';

import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Brands from '../brands.entity';
import { Employee } from './employees/employees.entity';
import { Category } from './products/categories/categories.entity';
import { Product } from './products/products.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid') // Genera automáticamente un UUID para cada instancia
  id: string; // Cambia el tipo de `number` a `string`

  @Column({ length: 100 })
  name: string;

  @Column('text')
  address: string;

  // Aquí puedes agregar más campos según sean necesarios,
  // por ejemplo, un campo para la ciudad, el teléfono, etc.
  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone: string;

  // Relación con la entidad User
  @OneToMany(() => User, (user) => user.store) // Establece la relación inversa aquí
  users: User[];

  @OneToMany(() => POS, (pos) => pos.store)
  pos: POS[];

  @ManyToOne(() => Brands, (brand) => brand.stores) // Asume que Brand tiene un array 'stores'
  brand: Brands;

  @OneToMany(() => Employee, (employee) => employee.store) // Nueva relación con Employee
  employees: Employee[];

  @ManyToMany(() => Category, (category) => category.store)
  @JoinTable({
    name: 'store_categories', // Nombre de la tabla de unión
    joinColumn: {
      name: 'storeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  // Agregando la relación Many-to-Many con Product
  @ManyToMany(() => Product, (product) => product.stores)
  products: Product[];

  // Nueva columna config para almacenar datos JSON de configuración
  @Column({
    type: 'json',
    nullable: false,
    default: () => `'{
      "theme": "dark",
      "currency": "USD",
      "paymentOptions": {
        "acceptCreditCard": true,
        "acceptCash": true,
        "creditCardProcessor": "Stripe",
        "taxes": false
      },
      "receiptOptions": {
        "printReceipt": true,
        "emailReceipt": true
      },
      "integrations": {
        "kitchenDisplay": true,
        "deliveryOption": true
      },
      "planDetails": {
        "planType": "basic",
        "customerLimit": 100,
        "invoiceLimit": 500,
        "additionalFeatures": {
          "customReports": false,
          "multipleLocations": false,
          "advancedAnalytics": false
        }
      }
    }'`,
  })
  config: any;
}

export default Store;
