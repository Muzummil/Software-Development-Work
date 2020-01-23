import {Pipe, PipeTransform} from '@angular/core'
var moment = require('moment');

@Pipe({name: 'calcAge'})
export class CalcAgePipe implements PipeTransform {

    transform(value:Date) {

        if (value) {

            return  moment(new Date()).diff(value, 'years');

        }
        return null;
    }

}
@Pipe({name: 'day'})
export class DayPipe implements PipeTransform {

    transform(value:Date) {

        if (value) {

            let day = value.getDay();
            return day;
        }

        return null;
    }

}


declare var moment:any;
@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {

    transform(value,args:string[]){

        let selDate = value;
        if(value){
            return  moment(selDate).utc().format(args)
        }
        return null;
    }
}




@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {

    monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

    transform(value:string, args:string) {


        let date1 = new Date(args);
        let date2 = new Date(value);
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let diffMonths = this.monthDiff(date2,date1);
        let diffYears = diffMonths/12;
        let returnVal = null;
        if(diffYears > 1) {
            returnVal =  (diffYears == 1)? diffYears.toFixed(1)+" Year" : diffYears.toFixed(1)+" Years"

        }
        else if(diffMonths > 1){
            returnVal =  (diffMonths == 1)? diffMonths.toFixed(0)+" Month" : diffMonths.toFixed(0)+" Months"
        }
        else if(diffDays > 1){
            returnVal =  (diffDays == 1)? diffDays.toFixed(0)+" Day" : diffDays.toFixed(0)+" Days"
        }

        return returnVal;


    }

}
