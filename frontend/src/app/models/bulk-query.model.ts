import { Query } from "./query.model";
import { Status } from "./status.enum";


export class BulkQuery {
  id!: string;
  type!: string;
  token!: string;
  timestamp!: Date;
  status!: Status;
  items: Array<Query> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.type = data.type;
      this.token = data.token;
      this.timestamp = new Date(data.timestamp);
      this.status = data.status;
      if (data.items) {
        for (var item_data of data.items) {
          this.items.push(new Query(item_data));
        }
      }
    }
  }
}
