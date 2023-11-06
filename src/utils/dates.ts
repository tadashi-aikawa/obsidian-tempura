import { Moment, MomentInput } from "../types";
declare function moment(inp?: MomentInput, strict?: boolean): Moment;

export function getDatesInRange(begin: Moment, end: Moment): Moment[] {
  const dates = [];
  const date = moment(begin).startOf("day");
  const endDate = moment(end).startOf("day");

  if (date.isAfter(endDate)) {
    throw new Error("beginDate is after endDate");
  }

  while (true) {
    dates.push(date.clone());
    if (date.add(1, "days").diff(endDate) > 0) {
      break;
    }
  }

  return dates;
}
