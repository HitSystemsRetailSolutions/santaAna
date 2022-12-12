export interface ClientesInterface {
    id: string;
    nombre: string;
    tarjetaCliente: string;
    albaran: boolean;
    noPagaEnTienda: boolean;
  }
  
  export interface ClientesAlbaranInterface {
    Codi: number;
    idCliente: string;
    pagaEnTienda: "1" | "NoPagaEnTienda";
    nombre: string;
    idTarjeta: string;
  }
  