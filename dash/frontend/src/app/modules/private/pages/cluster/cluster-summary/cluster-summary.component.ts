import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { IImageScanCount } from '../../../../../core/entities/IImage';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { IServerResponse } from '../../../../../core/entities/IServerResponse';
import { ImageService } from '../../../../../core/services/image.service';
import { ClusterService } from '../../../../../core/services/cluster.service';
import { INamespaceTotalVulnerability } from '../../../../../core/entities/INamespaceTotalVulnerability';
import { IClusterEvent } from '../../../../../core/entities/IClusterEvent';
import { MatDialog } from '@angular/material/dialog';
import { ClusterEventComponent } from '../cluster-event/cluster-event.component';
import { merge, Subject } from 'rxjs';
import { MatSort} from '@angular/material/sort';
import { PodService } from 'src/app/core/services/pod.service';
import { format, sub } from 'date-fns';
import { take, takeUntil } from 'rxjs/operators';
import { ChartSizeService } from '../../../../../core/services/chart-size.service';
import {environment} from '../../../../../../environments/environment.prod';
import {NgxUiLoaderConfig, NgxUiLoaderService, POSITION, SPINNER} from 'ngx-ui-loader';

@Component({
  selector: 'app-cluster-summary',
  templateUrl: './cluster-summary.component.html',
  styleUrls: ['../../../../../../styles.scss', './cluster-summary.component.scss']
})

export class ClusterSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  subNavigationTitle: string;
  subNavigationButtonTitle: string;
  clusterId: number;
  imageScanData: IImageScanCount[];
  totalVulnerabilities = 0;
  countOfPolicyViolations: number;
  countOfTotalImagesRunning: number;
  displayedColumns: string[] = ['namespace', 'criticalIssues', 'majorIssues', 'mediumIssues', 'lowIssues', 'negligibleIssues'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<INamespaceTotalVulnerability>;
  barChartAttributes = {
    view: [],
    colorScheme: {
      domain: ['#ec3c3c', '#f3865f', '#596fe0', '#59e059']
    },
    results: [],
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    barPadding: 2,
    showLegend: false,
    legendPosition: 'below',
    showXAxisLabel: true,
    showYAxisLabel: true,
    yAxisLabel: 'Vulnerabilities',
    xAxisLabel: 'Day of Month',
  };
  lineChartAttributes = {
    view: [],
    colorScheme: {
      domain: ['#59e059']
    },
    results: [],
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    showLegend: false,
    legendPosition: 'below',
    showXAxisLabel: true,
    showYAxisLabel: true,
    autoScale: false,
    yAxisLabel: 'Total Scans',
    xAxisLabel: 'Day of Month',
    yScaleMin: 0,
    yAxisTicks: [],
  };
  complianceSummaryLineChartAttributes = {
    view: [],
    colorScheme: {
      domain: ['#59e059']
    },
    results: [],
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    showLegend: false,
    legendPosition: 'below',
    showXAxisLabel: true,
    showYAxisLabel: true,
    autoScale: false,
    yAxisLabel: 'Pod Compliance %',
    xAxisLabel: 'Day of Month',
    yScaleMin: 0,
    yScaleMax: 100,
    yAxisTicks: [0, 25, 50, 75, 100],
  };
  page = 0;
  limit = 10;
  clusterEvents: IClusterEvent[];
  resizeTimeout;
  logLoaderName = 'cluster-logs-loader';
  logsLoaderConfig: NgxUiLoaderConfig = {
    bgsType: SPINNER.rectangleBounce,
    bgsPosition: POSITION.centerCenter,
  };
  scanXTickFormatting = (e: string) => {
    return e.split('-')[2];
  }
  constructor(private route: ActivatedRoute,
              private imageService: ImageService,
              private clusterService: ClusterService,
              private podService: PodService,
              private alertService: AlertService,
              private dialog: MatDialog,
              private chartSizeService: ChartSizeService,
              protected readonly loaderService: NgxUiLoaderService,
              ) {
  }

  ngOnInit(): void {
    this.subNavigationTitle = 'Summary';
    this.route.parent.params
      .pipe(take(1))
      .subscribe(param => {
        this.clusterId = param.id;
        this.setChartHeightWidthWithoutTimeout();  // starts at a reasonable size

        this.getCountOfImageScan(this.clusterId);
        this.getCountOfVulnerabilities(this.clusterId);
        this.getTotalVulnerabilities(this.clusterId);
        this.getPolicyViolationCount(this.clusterId);
        this.getCountOfFilteredImages({clusterId: this.clusterId, runningInCluster: true});
        this.getPodComplianceSummaryForAllClusters(this.clusterId);
        this.getClusterEvents(this.limit, this.page);
      }
    );
  }

  ngAfterViewInit() {
    merge(this.route.queryParams, this.sort.sortChange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.namespaceTotalVulnerabilityByClusterId());
    this.setChartHeightWidth();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window:resize', ['$event'])
  calculateScreenSize($event?: any) {
    this.setChartHeightWidth();
  }

  setChartHeightWidth(){
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.setChartHeightWidthWithoutTimeout();
    }, 1000);
  }

  setChartHeightWidthWithoutTimeout() {
    const innerWindow = document.getElementsByTagName('app-cluster-summary').item(0) as HTMLElement;

    this.lineChartAttributes.view = this.chartSizeService.getChartSize(
      innerWindow.getBoundingClientRect().width,
      { xs: 1, s: 1, m: 2, l: 3},
      { left: 20, right: 20 },
      { left: 20, right: 20 },
      { left: 5, right: 5 },
      { left: 6, right: 16 },
    );
    this.barChartAttributes.view = this.lineChartAttributes.view;
    this.complianceSummaryLineChartAttributes.view = this.lineChartAttributes.view;
  }

  namespaceTotalVulnerabilityByClusterId(){
    this.clusterService.namespaceTotalVulnerabilityByClusterId(this.clusterId, this.sort)
      .pipe(take(1))
      .subscribe((response: IServerResponse<INamespaceTotalVulnerability[]>) => {
      this.dataSource = new MatTableDataSource(response.data);
    }, error => {
      this.alertService.danger(error.error.message);
    });
  }

  getPodComplianceSummaryForAllClusters(clusterId: number) {
    this.podService.getPodsComplianceSummary({ clusterId })
        .pipe(take(1))
        .subscribe(response => {
      const complianceSummaryData = response.data;
      if (complianceSummaryData && complianceSummaryData.length === 0) {
        return false;
      }
      this.complianceSummaryLineChartAttributes.results = [
        {
          name: '',
          series: complianceSummaryData.map(imageScan => {
            return {
              name: imageScan.dateString,
              value: +imageScan.percentage
            };
          })
        }
      ];
    }, error => {
      if (!environment.production) {
        console.log(`Error in Get Count Of Deployment By Compliant Status`, error);
      }
    });
  }

  getCountOfImageScan(clusterId: number) {
    this.imageService.getCountOfImageScan([clusterId])
      .pipe(take(1))
      .subscribe((response: IServerResponse<IImageScanCount[]>) => {
        this.imageScanData = response.data;
        if (this.imageScanData && this.imageScanData.length === 0) {
          return false;
        }
        const imageCounts = response.data.map(r => r.count);
        const lineChartRange = this.clusterService.calculateScanHistoryChartRange(imageCounts);
        this.lineChartAttributes.yAxisTicks = lineChartRange.yAxisTicks;
        this.lineChartAttributes.results = [
          {
            name: '',
            series: this.imageScanData.map(imageScan => {
              return {
                name: imageScan.date.split('T')[0],
                value: +imageScan.count
              };
            })
          }
        ];
      }, error => {
        this.alertService.danger(error.error.message);
      }
    );
  }

  getCountOfFilteredImages(filterBy: {clusterId: number, runningInCluster?: boolean}) {
    this.imageService.getCountOfFilteredImages(filterBy)
      .pipe(take(1))
      .subscribe(response => {
      this.countOfTotalImagesRunning = +response.data;
    }, error => {
        if (!environment.production) {
          console.log(`Error in get image summary`, error);
        }
    });
  }

  getCountOfVulnerabilities(clusterId: number) {
    const startDate = format(sub(new Date(), {days: 28}), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const filters = {clusterIds: [clusterId], startDate, endDate};
    this.imageService.getCountOfVulnerabilities(filters, 'savedAtDate')
      .pipe(take(1))
      .subscribe(response => {
        this.barChartAttributes.results = response.data && response.data.length > 0 ? response.data.map(data => {
          return {
            name: data.savedAtDate.split('T')[0],
            series : [
              {
                name: 'Critical',
                value: +data.criticalIssues
              },
              {
                name: 'Major',
                value: +data.majorIssues
              },
              {
                name: 'Medium',
                value: +data.mediumIssues
              },
              {
                name: 'Low',
                value: +data.lowIssues
              },
            ]
          };
        }) : [];
      },
      error => {
        this.alertService.danger(error.error.message);
      });
  }

  getTotalVulnerabilities(clusterId: number) {
    this.imageService.getTotalVulnerabilities(clusterId, {})
      .pipe(take(1))
      .subscribe((response: IServerResponse<number>) => {
      this.totalVulnerabilities = response.data;
    }, error => {
      this.alertService.danger(error.error.message);
    });
  }

  getClusterEvents(limit: number, page: number) {
    this.loaderService.startBackgroundLoader(this.logLoaderName, 'load-logs');
    this.clusterService.getClusterEvents(this.clusterId, limit, page)
      .pipe(take(1))
      .subscribe({
        next: (response: IServerResponse<IClusterEvent[]>) => {
          if (response.data) {
            if (this.page > 0) {
              this.clusterEvents.push(...response.data);
            } else {
              this.clusterEvents = response.data;
            }
          }
          this.loaderService.stopBackgroundLoader(this.logLoaderName, 'load-logs');
          },
        error: error => {
          this.loaderService.stopBackgroundLoader(this.logLoaderName, 'load-logs');
          this.alertService.danger(error.error.message);
        }
      });
  }

  getPolicyViolationCount(clusterId: number) {
    this.imageService.getPolicyViolationCount(clusterId)
      .pipe(take(1))
      .subscribe((response: IServerResponse<number>) => {
      this.countOfPolicyViolations = response.data[0].count;
    }, error => {
      this.alertService.danger(error.error.message);
    });
  }

  openEventDetailsDialog(event: IClusterEvent) {
    this.dialog.open(ClusterEventComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: 550,
      maxHeight: 600,
      minWidth: 100,
      minHeight: 100,
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      data: {
        eventId: event.id,
        createdDate: event.createdDate,
        type: event.type,
        level: event.level,
        data: event.data,
        description: event.description,
      }
    });
  }

  onScroll() {
    this.page = this.page + 1;
    this.getClusterEvents(this.limit, this.page);
  }
}
