import { Injectable } from '@angular/core';
import { ElectronService } from 'app/core/services';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(
    private electron: ElectronService,
  ) { }
}
