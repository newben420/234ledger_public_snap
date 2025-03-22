import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { StatsService } from '../../services/stats.service';
import { PreloaderService } from '../../services/preloader.service';
import { NoteService } from '../../services/note.service';
import { abbreviateNumber } from '@shared/model/abbr_number';
import { countryCodesMap } from '@shared/model/location';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

  data: number[][] = [[], [], [], [], [], []];
  label: string[][] = [[], [], [], [], [], []];
  CCM = countryCodesMap;

  getData(i: number): any {
    return [
      {
        data: this.data[i],
        borderWidth: 0,
      },
    ];
  }

  numerical: string[] = ['0', '0', '0', '0', '0', '0'];

  constructor(
    private stats: StatsService,
    private prel: PreloaderService,
    private note: NoteService,
  ) {
  }

  loadStats() {
    this.prel.show();
    this.stats.loadStats(r => {
      this.prel.hide();
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        this.numerical[0] = abbreviateNumber(r.message[0][0]['l']);
        this.numerical[1] = abbreviateNumber(r.message[1][0]['l']);
        this.numerical[2] = abbreviateNumber(r.message[2][0]['l']);
        this.numerical[3] = abbreviateNumber(r.message[3][0]['l']);
        this.numerical[4] = abbreviateNumber(r.message[4][0]['l']);
        this.numerical[5] = abbreviateNumber(r.message[5][0]['l']);
        let i: number;
        let n: number = 12;
        for (i = 6; i < n; i++) {
          let data: number[];
          let label: string[];
          data = [];
          label = [];
          (r.message[i] as any[]).forEach(x => {
            data.push(x.data);
            label.push(this.CCM[x.label] || x.label);
          });
          this.data[i - 6] = data;
          this.label[i - 6] = label;
        }
      }
    });
  }

  ngOnInit() {
    this.loadStats();
  }

  ngOnDestroy() {
  }

  chartOpts: ChartOptions<'doughnut'> = {
    responsive: true,
    aspectRatio: 1,
    cutout: '50%',
  };

}
