import {Trace} from "../interface/response/trace";

export class ErrorResponse {
  message: string;
  exception?: string;
  file?: string;
  line?: number;
  trace?: Trace[];
}
