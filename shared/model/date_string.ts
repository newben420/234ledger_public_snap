import { LocalRegex } from './regex';
export const getDateString = (ts: number = Date.now()):string => {
    let date = new Date(ts);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    if(day.length == 1){
      day = `0${day}`;
    }
    if(month.length == 1){
      month = `0${month}`;
    }
    return `${year}-${month}-${day}`;
  }

  export const dateTimeToTimestamp = (dateTime: string): number => {
    const match = dateTime.match(LocalRegex.dateTime);
    if(!match){
      return 0;
    }
    const [_, year, month, day, hour, minute] = match;
    return (new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))).getTime();
  }

  export const timestamptoDateTime = (timestamp: number): string => {
    let d = new Date(timestamp);
    let y: string = d.getFullYear().toString();
    let m: string = (d.getMonth() + 1).toString();
    let dd: string = d.getDate().toString();
    let h: string = d.getHours().toString();
    let mm : string= d.getMinutes().toString();
    m = m.length == 1 ? `0${m}` : m;
    dd = dd.length == 1 ? `0${dd}` : dd;
    h = h.length == 1 ? `0${h}` : h;
    mm = mm.length == 1 ? `0${mm}` : mm;
    return `${y}-${m}-${dd} ${h}:${mm}`;
  }

  