import { Client } from 'pg';
//Si se usa wsl se tiene que configurar el postgres para entrada remota
//Se tiene que configurar el cortafuegos 
//(Tip),Recuerda que wsl y tu windows tienen distinta ip 
const dataAccess = {
  host: '192.168.101.8',
  port: 5432,
  database: 'timetracker',
  user: 'kevin',
  password: 'root',
};

class Database {
  private static instance: Database;
  private client: Client;

  private constructor() {
    this.client = new Client(dataAccess);
    this.connect(); // Conectar en el constructor, solo se hará la primera vez que se instancia
  }

  private async connect():Promise<void> {
    try {
      await this.client.connect();
      console.log('Conectado a la base de datos');
    } catch (err:any) {
      console.error('Error al conectar a la base de datos:', err.message);
    }
  }

  public static getInstance(): Client {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance.client;
  }
}

const database = Database.getInstance();
export { database };
