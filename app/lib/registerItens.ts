'use server';

import { prisma } from "./prisma/prisma";

type ItensType = {
  model: string;
  hostname?: string;
  client?: string;
  serialNumber?: string;
  status: boolean;
  spaceQuantity: number;
  equipamentType: string;
  assetNumber: number;
  equipamentBrand: string;
  positionInRack: number;
  observations?: string;
  rackRackNumber: number;
};

export default async function registerItens(data: ItensType) {
  try {
    const newEquipment = await prisma.equipament.create({
      data: {
        model: data.model,
        hostname: data.hostname || undefined,
        client: data.client || undefined,
        serialNumber: data.serialNumber || undefined,
        status: data.status,
        spaceQuantity: data.spaceQuantity,
        equipamentType: data.equipamentType,
        assetNumber: data.assetNumber,
        equipamentBrand: data.equipamentBrand,
        positionInRack: data.positionInRack,
        observations: data.observations || undefined,
        rackRackNumber: data.rackRackNumber,
      },
    });

    return newEquipment;
  } catch (err: any) {
    console.error("Erro ao criar equipamento:", err.message);
    throw new Error(`Erro ao criar equipamento: ${err.message}`);
  }
}
