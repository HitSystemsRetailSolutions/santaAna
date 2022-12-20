import { ObjectId } from "mongodb";

export interface CajaSincro {
  _id?: ObjectId;
  inicioTime: number;
  idDependientaApertura: number;
  totalApertura: number;
  detalleApertura: DetalleMonedas;
  finalTime: number;
  idDependientaCierre: number;
  totalCierre: number;
  descuadre: number;
  recaudado: number;
  nClientes: number;
  primerTicket: number;
  totalSalidas: number;
  totalEntradas: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalDatafono3G: number;
  totalDeuda: number;
  totalTkrsSinExceso: number;
  totalTkrsConExceso: number;
  ultimoTicket: number;
  calaixFetZ: number;
  detalleCierre: DetalleMonedas;
  mediaTickets: number;
  enviado: boolean;
}

export type DetalleMonedas = {
  _id: string;
  valor: number;
  unidades: number;
}[];
