import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {AlertService} from '@full-fledged/alerts';
import {PolicyService} from '../../../../../core/services/policy.service';
import {ScannerService} from '../../../../../core/services/scanner.service';
import {ScannerListComponent} from '../../scanners/scanner-list/scanner-list.component';
import {IScanner, IScannerDialogData, ScannerData} from '../../../../../core/entities/IScanner';
import {ScannerCreateComponent} from '../../scanners/scanner-create/scanner-create.component';
import {IServerResponse} from '../../../../../core/entities/IServerResponse';
import {JwtAuthService} from '../../../../../core/services/jwt-auth.service';
import {CustomValidators} from '../../../form-validator/custom-validators';
import {ClusterService} from '../../../../../core/services/cluster.service';
import {ConfirmationDialogComponent} from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatOptionSelectionChange} from '@angular/material/core';

@Component({
  selector: 'app-policy-create',
  templateUrl: './policy-create.component.html',
  styleUrls: ['./policy-create.component.scss']
})
export class PolicyCreateComponent implements OnInit {
  policyForm: FormGroup;
  subMenuTitle: string;
  scannerSubmenuTitle = 'Policy Requirements';
  checkIfEdit: boolean;
  checkboxDefault = true;
  policyId: number;
  allScanners = [];
  dataSource: MatTableDataSource<IScanner>;
  displayedColumns: string[] = ['enabled', 'required', 'name', 'description', 'type', 'actions'];
  scannerData: ScannerData[] = new Array();
  @ViewChild(ScannerListComponent) scannerList;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  currentScannerData: any;
  currentPolicy: any;

  clusterGroups: any[] = [];
  policyClusterMap: any[] = [];

  relevantForAllClusters = true;
  relevantForSpecificClusters = true;

  constructor(
    private formBuilder: FormBuilder,
    private policyService: PolicyService,
    private scannerService: ScannerService,
    private clusterService: ClusterService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private jwtAuthService: JwtAuthService,
    private location: Location) {

    const getCurrentUrl = this.router.url;
    this.checkIfEdit = getCurrentUrl.split('/').reverse()[0] === 'edit';
    this.policyForm = this.formBuilder.group({
      name: ['', [CustomValidators.requiredNoTrim,
        Validators.maxLength(255)]],
      description: ['', CustomValidators.requiredNoTrim],
      new_scan_grace_period: ['', Validators.pattern(/^\d+$/)],
      rescan_grace_period: ['', Validators.pattern(/^\d+$/)],
      tempExceptionEnabled: ['', Validators.required],
      rescanEnabled: ['', Validators.required],
      enabled: ['', Validators.required],
      enforcement: ['', [Validators.required]],
      clusters: ['', [Validators.required]]
    });

    if (this.checkIfEdit) {
      console.log('policy name: ', this.policyService);
      this.subMenuTitle = 'Edit Policy';
    } else {
      this.subMenuTitle = 'Create Policy';
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.policyId = params.id;
    });
    this.loadAllClusters();
    if (this.checkIfEdit) {
      this.policyService.getPolicyById(this.policyId).subscribe(response => {
        // @todo need to resolve this issue
        // this.currentScannerData = response.data.scannerIds;
        this.currentScannerData = [];
        this.currentPolicy = response.data;
        this.loadPolicyClusterMap(this.policyId);
        this.populatePolicyForm();
        this.getAllScannersByPolicyId();
      });
    }
  }

  loadAllClusters() {
    this.clusterService.getAllClusters().subscribe(response => {
      const clusters = response.data;
      this.clusterGroups = clusters.reduce((groupByData, current) => {
        const existingClusterGroupIndex = groupByData.findIndex(g => g.id === current.group.id);
        if (existingClusterGroupIndex > -1) {
          groupByData[existingClusterGroupIndex].clusters.push({
            id: current.id,
            name: current.name,
            tags: current.tags
          });
        } else {
          groupByData.push({
            id: current.group.id,
            name: current.group.name,
            clusters: [
              {id: current.id, name: current.name, tags: current.tags}
            ]
          });
        }
        return groupByData;
      }, []);
    }, error => {
      this.alertService.danger('Clusters not found in this cluster group');
    });
  }

  loadPolicyClusterMap(policyId: number) {
    if (this.currentPolicy.relevantForAllClusters) {
      this.policyForm.get('clusters').setValue(['all']);
      this.relevantForAllClusters = true;
      this.relevantForSpecificClusters = false;
    } else {
      this.policyService.getPolicyClusterMapById(policyId).subscribe(response => {
        this.policyClusterMap = response.data;
        console.log('PCM: ', this.policyClusterMap.map(pcm => pcm.id));
        this.policyForm.get('clusters').setValue(this.policyClusterMap.map(pcm => pcm.id));
        this.relevantForAllClusters = false;
        this.relevantForSpecificClusters = true;
      }, error => {
        this.alertService.danger('Failed to load policy cluster map');
      });
    }
  }

  getAllScannersByPolicyId() {
    this.dataSource = null;
    this.scannerService.getAllScannersByPolicyId(this.policyId).subscribe((result: IServerResponse<IScanner[]>) => {
      if (result.data) {
        this.allScanners = result.data;
        this.dataSource = new MatTableDataSource(result.data);
        this.dataSource.sort = this.sort;
      }
    });
  }

  onSubmit() {
    const policy = this.policyForm.getRawValue();
    const clusters = policy.clusters.includes('all') ? [] : policy.clusters;
    policy.relevantForAllClusters = policy.clusters.includes('all') ? true : false;
    delete policy.clusters;
    // const createPolicyData = {
    //   ...this.policyForm.value,
    //   ...{scannerIds: this.checkIfEdit ? this.currentScannerData : this.scannerData}
    // };

    policy.name = policy.name.trim();
    // Sending empty strings will fail
    policy.new_scan_grace_period = policy.tempExceptionEnabled ? (policy.new_scan_grace_period || null) : 0;
    policy.rescan_grace_period = policy.rescanEnabled ? (policy.rescan_grace_period || null) : 0;
    policy.description = policy.description.trim();

    const policyCreateData = {
      policy,
      scanners: this.allScanners,
      clusters
    };

    if (this.checkIfEdit) {
      this.policyService.updatePolicy(policyCreateData, this.policyId).subscribe((response) => {
        this.alertService.success('Policy updated successfully');
      }, error => {
        this.alertService.danger(error.error.message);
      }, () => {
        this.router.navigate(['/private', 'policies']);
      });
    } else {
      this.policyService.createPolicy(policyCreateData).subscribe((response) => {
        this.alertService.success('Policy added successfully');
      }, error => {
        this.alertService.danger(error.error.message);
      }, () => {
        this.router.navigate(['/private', 'policies']);
      });
    }
  }

  openAddScannerDialog() {
    const confirmDialog = this.dialog.open(ScannerCreateComponent, {
      width: '620px',
      height: '500px',
      closeOnNavigation: true,
      disableClose: true,
      data: {policyId: +this.policyId, isPolicyEdit: this.checkIfEdit}
    });
    confirmDialog.afterClosed().subscribe((result: IScannerDialogData) => {
      if (!result.isClose) {
        if (this.policyId) {
          this.getAllScannersByPolicyId();
        } else {
          this.allScanners.push(result.value);
          this.dataSource = new MatTableDataSource(this.allScanners);
        }
      }
    });
  }

  populatePolicyForm() {
    this.policyForm.controls.name.setValue(this.currentPolicy.name);
    this.policyForm.controls.description.setValue(this.currentPolicy.description);
    this.policyForm.controls.new_scan_grace_period.setValue(this.currentPolicy.newScanGracePeriod);
    this.policyForm.controls.rescan_grace_period.setValue(this.currentPolicy.rescanGracePeriod);
    this.policyForm.controls.enabled.setValue(this.currentPolicy.enabled);
    this.policyForm.controls.enforcement.setValue(this.currentPolicy.enforcement);
    this.updateTempExceptionEnabled(this.currentPolicy.newScanGracePeriod);
    this.updateRescanEnabled(this.currentPolicy.rescanGracePeriod);
  }

  editScanner(scannerRow, index) {
    const confirmDialog = this.dialog.open(ScannerCreateComponent, {
      width: '620px',
      height: '500px',
      closeOnNavigation: true,
      disableClose: true,
      data: {scannerData: scannerRow, isEdit: true, isPolicyEdit: this.checkIfEdit, policyId: +this.policyId}
    });
    confirmDialog.afterClosed().subscribe((result: IScannerDialogData) => {
      if (!result.isClose) {
        if (this.checkIfEdit) {
          this.getAllScannersByPolicyId();
        } else {
          this.allScanners[index] = result.value;
          this.dataSource = new MatTableDataSource(this.allScanners);
          this.dataSource.sort = this.sort;
        }
      }
    });
  }

  alertDeletePolicy(id: number, index: number) {
    const openRemoveDialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      closeOnNavigation: true,
      disableClose: true
    });

    openRemoveDialog.afterClosed().subscribe(result => {
      if (result === undefined) {
        if (this.checkIfEdit){
          this.deleteScannerById(id);
        } else {
          this.allScanners.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.allScanners);
          this.dataSource.sort = this.sort;
        }
      }
    });
  }

  deleteScannerById(id: number) {
    this.scannerService.deleteScannerById(id).subscribe((result: IServerResponse<number>) => {
      if (result.data) {
        this.alertService.success('Scanner deleted successfully');
      }
    }, error => {
      this.alertService.danger(error.error.message);
    }, () => {
      this.getAllScannersByPolicyId();
    });
  }

  cancelPolicyForm() {
    this.location.back();
  }

  handleRelevantForAllClusters($event) {
    if ($event.source.value.length === 0) {
      this.relevantForAllClusters = true;
      this.relevantForSpecificClusters = true;
    }
    else {
      if ($event.source.value.includes('all')) {
        this.relevantForAllClusters = true;
        this.relevantForSpecificClusters = false;
      } else {
        this.relevantForAllClusters = false;
        this.relevantForSpecificClusters = true;
      }
    }
    // console.log($event.source.value);
  }

  private updateTempExceptionEnabled(newGracePeriod: number)  {
    if (newGracePeriod > 0) {
      this.policyForm.controls.tempExceptionEnabled.setValue(true);
    }
    else {
      this.policyForm.controls.tempExceptionEnabled.setValue(false);
    }
  }

  private updateRescanEnabled(rescanGracePeriod: number)  {
    if (rescanGracePeriod > 0) {
      this.policyForm.controls.rescanEnabled.setValue(true);
    }
    else {
      this.policyForm.controls.rescanEnabled.setValue(false);
    }
  }

}
