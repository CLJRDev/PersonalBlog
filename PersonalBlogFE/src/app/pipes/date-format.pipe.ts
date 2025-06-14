import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateFormat'
})

export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, dateFormat: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';
    try {
      return format(new Date(value), dateFormat);
    } catch {
      return '';
    }
  }
}