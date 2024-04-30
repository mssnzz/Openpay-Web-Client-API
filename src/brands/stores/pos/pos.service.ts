import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POS } from './pos.entity';
import Store from '../stores.entity';

@Injectable()
export class PosService {
  constructor(
    @InjectRepository(POS)
    private readonly posRepository: Repository<POS>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>, // Inyecta el repositorio de Store
  ) {}

  generatePairingCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async create(name: string, storeUuid: string): Promise<POS> {
    const pairingCode = this.generatePairingCode();

    // Busca la tienda por su UUID antes de asignarla
    const store = await this.storeRepository.findOneBy({ id: storeUuid });
    if (!store) {
      throw new Error('Store not found');
    }
    console.log(storeUuid);
    const pos = this.posRepository.create({
      name,
      status: 'inactive',
      pairingCode,
      store, // Asigna directamente el objeto de tienda encontrado
    });

    return this.posRepository.save(pos);
  }
  async findPosWithStoreAndBrand(id: string): Promise<POS> {
    const pos = await this.posRepository.findOne({
      where: { id },
      relations: ['store', 'store.brand'], // Asume que tienes las relaciones 'store' en POS y 'brand' en Store
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
  ): Promise<{ pairingCode: string; storeName: string }> {
    const pos = await this.posRepository.findOne({
      where: { pairingCode, status: initialStatus },
      relations: ['store'], // Cargar la relación con Store
    });

    if (!pos) {
      throw new Error('POS not found or status is not as expected');
    }

    if (!pos.store) {
      throw new Error('Store information is not available');
    }

    pos.status = finalStatus; // Cambiar el estado
    await this.posRepository.save(pos);

    // Devolver el código de emparejamiento y el nombre de la tienda
    return {
      pairingCode: pos.pairingCode,
      storeName: pos.store.name, // Asegúrate de que la entidad Store tenga una columna 'name'
    };
  }
  async getPosInfoByPairingCode(pairingCode: string): Promise<any> {
    const pos = await this.posRepository.findOne({
      where: { pairingCode },
      relations: ['store'], // Asume que 'store' es el nombre de la relación en la entidad POS
    });

    if (!pos) {
      throw new Error('POS not found with the provided pairing code.');
    }

    // Aquí tienes acceso tanto a la información del POS como a la del Store relacionado
    // Puedes devolver la información necesaria o todo el objeto POS con su tienda relacionada
    return pos;
  }
}
