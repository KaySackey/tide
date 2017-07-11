import * as human_date from 'human-date';

const ONE_HOUR = 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

/**
 Returns date as a string
 - Up to 8 days, it returns X hours ago. Or X hours Y minutes ago, etc.
 - After that, it returns the exact date

 * @param {Date} input
 * @returns {string}
 */
export function humanize_date(input: Date | number) {
    let a_date : Date;

    if(!input){
        return "?"
    }
    if(typeof input === "number"){
        // Assume time in seconds
        a_date = new Date(input)
    }else{
        a_date = input as Date;
    }

    const now : Date = new Date();
    const diff_in_seconds = Math.abs(now.getTime() - a_date.getTime()) / 1000;

    // Future Dates disallowed....
    if(diff_in_seconds < 0){
        return "now"
    }

    // Less than 8 days ago
    if(diff_in_seconds < 8 * ONE_DAY){
        // E.g. 10 seconds ago
        return human_date.relativeTime(-1 * diff_in_seconds)
    }

    // This year
    if(a_date.getFullYear() === now.getMonth()){
        // E.g. Jan 17
        return `${human_date.monthName(a_date)} ${a_date.getDate()}`
    }

    // Last year
    // E.g. June 29th, 2016
    return human_date.prettyPrint();
}