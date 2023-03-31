import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDateTime'
})
export class MyDateTimePipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe,
  ) { }

  transform(value: any, args?: any): any {
    let result = null;
    if (value) {
      result = this.datePipe.transform(value, 'MMM d, y, h:mm a', '+00:00');;
    }
    return result;
  }

}
