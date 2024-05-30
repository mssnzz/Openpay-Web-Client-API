import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POS } from './pos.entity';
import Store from '../stores.entity';
import Brands from 'src/brands/brands.entity';

@Injectable()
export class PosService {
  constructor(
    @InjectRepository(POS)
    private readonly posRepository: Repository<POS>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Brands)
    private readonly brandRepository: Repository<Brands>,
  ) {}

  generatePairingCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async create(name: string, storeUuid: string): Promise<POS> {
    const pairingCode = this.generatePairingCode();
    const store = await this.storeRepository.findOneBy({ id: storeUuid });
    if (!store) {
      throw new Error('Store not found');
    }
    console.log(storeUuid);
    const pos = this.posRepository.create({
      name,
      status: 'inactive',
      pairingCode,
      store,
    });

    return this.posRepository.save(pos);
  }

  async findPosWithStoreAndBrand(id: string): Promise<POS> {
    const pos = await this.posRepository.findOne({
      where: { id },
      relations: ['store', 'store.brand'],
    });

    if (!pos) {
      throw new Error('POS not found');
    }

    return pos;
  }

  async findByPairingCodeAndChangeStatus(
    pairingCode: string,
    initialStatus: string,
    finalStatus: string,
  ): Promise<POS> {
    const pos = await this.posRepository.findOne({
      where: { pairingCode, status: initialStatus },
      relations: ['store'],
    });

    if (!pos) {
      throw new Error('POS not found or status is not as expected');
    }

    if (!pos.store) {
      throw new Error('Store information is not available');
    }

    pos.status = finalStatus;
    await this.posRepository.save(pos);

    return pos;
  }

  async getPosInfoByPairingCode(pairingCode: string): Promise<any> {
    const pos = await this.posRepository.findOne({
      where: { pairingCode },
      relations: ['store'],
    });

    if (!pos) {
      throw new Error('POS not found with the provided pairing code.');
    }

    return pos;
  }

  async findPosByBrandId(brandId: string): Promise<any[]> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
      relations: ['stores', 'stores.pos'],
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    const posList = brand.stores.flatMap((store) =>
      store.pos.map((pos) => ({
        ...pos,
        store: {
          id: store.id,
          name: store.name,
          address: store.address,
        },
        brand: {
          id: brand.id,
          name: brand.name,
        },
      })),
    );

    return posList;
  }

  async update(id: string, updateData: any): Promise<POS> {
    const pos = await this.posRepository.findOneBy({ id });
    if (!pos) {
      throw new Error('POS not found');
    }
    Object.assign(pos, updateData);
    return this.posRepository.save(pos);
  }

  async delete(id: string): Promise<void> {
    const pos = await this.posRepository.findOneBy({ id });
    if (!pos) {
      throw new Error('POS not found');
    }
    await this.posRepository.remove(pos);
  }
}
