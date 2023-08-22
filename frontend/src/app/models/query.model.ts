import { QueryResult } from "./query-result.model";
import { Status } from "./status.enum";


export class Query {
  id!: string;
  token!: string;
  query_string!: string;
  query_filters!: string;
  timestamp!: Date;
  status!: Status;
  results: Array<QueryResult> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.token = data.token;
      this.query_string = data.query_string;
      this.query_filters = data.query_filters;
      this.timestamp = new Date(data.timestamp);
      this.status = data.status;
      if (data.results) {
        for (var result_data of data.results) {
          this.results.push(new QueryResult(result_data));
        }
      }
    }
  }
}
