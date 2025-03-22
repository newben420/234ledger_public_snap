import { Component, Input } from '@angular/core';
import { TableConfig, TableLabel } from '@shared/model/table_config';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input('config') config: TableConfig = new TableConfig();

  pages: number = 0;
  pageArray: number[] = [];
  currentPage: number = 0;
  isDark!: boolean;
  themeSub!: Subscription

  constructor(private theme: ThemeService) {
    this.themeSub = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }

  activeFilter!: number;

  applyFilter(i: number) {
    if (this.config.filters != null) {
      this.config.filters = this.config.filters.map((x) => {
        x.active = false;
        return x;
      });
      if (this.activeFilter != i) {
        this.config.filters[i].active = true;
        this.activeFilter = i;
      } else {
        this.activeFilter = -1;
      }
    }
  }

  edit(index: number, column: string, currentValue: string){
    if(this.config.editableColumns ? this.config.editableColumns.indexOf(column) != -1 : false){
      if(this.config.editFunction){
        this.config.editFunction(index, column, currentValue);
      }
    }
  }

  filterOperation(value: any): boolean {
    switch (this.config.filters![this.activeFilter].relationship) {
      case 'eq':
        return ((typeof value == 'string') ? value.toLowerCase() : value) == ((typeof this.config.filters![this.activeFilter].value == 'string') ? this.config.filters![this.activeFilter].value.toLowerCase() : this.config.filters![this.activeFilter].value);
        break;
      case 'ge':
        return value >= this.config.filters![this.activeFilter].value;
        break;
      case 'gt':
        return value > this.config.filters![this.activeFilter].value;
        break;
      case 'le':
        return value <= this.config.filters![this.activeFilter].value;
        break;
      case 'lt':
        return value < this.config.filters![this.activeFilter].value;
        break;
      case 'ne':
        return ((typeof value == 'string') ? value.toLowerCase() : value) != ((typeof this.config.filters![this.activeFilter].value == 'string') ? this.config.filters![this.activeFilter].value.toLowerCase() : this.config.filters![this.activeFilter].value);
        break;
      default:
        return true;
    }
  }

  slicdByPage(page: number, data: any[]): any[] {
    return data
      .map((x, i) => ({...x, ind7567: i}))
      .filter(
        (x, i) =>
          i >= (page - 1) * this.config.itemsPerPage &&
          i < page * this.config.itemsPerPage
      )
      .filter((x) => {
        if (this.activeFilter == null || this.activeFilter == -1) {
          return true;
        } else {
          return this.filterOperation(
            x[this.config.filters![this.activeFilter].column]
          );
        }
      });
  }

  labelsAction(labels: TableLabel[]): TableLabel[] {
    if (this.config.actions) {
      return labels.concat([{ name: 'table.action', column: '########' }]);
    } else {
      return labels;
    }
  }

  changePage(num: number) {
    if (num != this.currentPage) {
      this.currentPage = num;
    }
  }

  ngOnInit() {
    this.initComp();
  }

  ngOnDestroy(){
    this.themeSub.unsubscribe();
  }

  ngOnChanges(){
    this.initComp();
  }

  initComp(){
    if(this.config.data){
      this.pages = Math.floor(this.config.data.length / this.config.itemsPerPage);
    if (this.config.data.length % this.config.itemsPerPage != 0) {
      this.pages++;
    }
    this.pageArray = Array(this.pages)
      .fill(this.pages)
      .map((x, i) => i + 1);
    if(this.currentPage == 0){
      this.currentPage = 1;
    }
    if(this.currentPage > this.pages){
      this.currentPage = this.pages;
    }
    }
  }
}
